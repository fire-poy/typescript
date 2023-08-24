"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PongGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const pong_service_1 = require("./pong.service");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const user_service_1 = require("../user/user.service");
const FPS = 80;
let PongGateway = class PongGateway {
    constructor(userService) {
        this.userService = userService;
        this.loger = new common_1.Logger('PongGateway');
        this.frameIntervals = {};
        this.pongServices = {};
        this.waitingForSecondPlayer = {};
        this.secondPlayerIds = {};
    }
    afterInit(server) {
        this.loger.log('Game server is initialized');
    }
    handleConnection(client, ...args) {
        const requestOrigin = client.handshake.headers.origin;
        if (requestOrigin !== `${process.env.URL_FRONTEND}`) {
            client.disconnect();
            return;
        }
        this.loger.log(`Client socket connected: ${client.id}`);
    }
    handleDisconnect(client) {
        this.loger.log(`Client socket disconnected: ${client.id}`);
    }
    handleCreateRoom(client, roomId) {
        client.join(roomId);
        this.pongServices[roomId] = new pong_service_1.PongService();
        this.waitingForSecondPlayer[roomId] = true;
        this.loger.log(`Room created: ${roomId}`);
        client.emit('waitingForSecondPlayer', roomId);
    }
    handleJoinRoom(client, [roomId, playerId]) {
        if (this.pongServices[roomId]) {
            client.join(roomId);
            this.secondPlayerIds[roomId] = playerId;
            this.loger.log(`Client socket ${client.id} joined room: ${roomId}`);
            if (this.waitingForSecondPlayer[roomId]) {
                this.waitingForSecondPlayer[roomId] = false;
                setTimeout(() => {
                    this.startGame(roomId);
                    this.emitSecondPlayerJoined(roomId);
                }, 3000);
            }
        }
        else {
            client.emit('error', 'Room does not exist');
        }
    }
    emitSecondPlayerJoined(roomId) {
        const playerId = this.secondPlayerIds[roomId];
        this.server.to(roomId).emit('secondPlayerJoined', playerId);
    }
    handleLeaveRoom(client, data) {
        const { roomId, userId } = data;
        client.leave(roomId);
        this.server.to(roomId).emit('leftRoom');
        this.loger.log(`Client socket ${client.id} left room: ${roomId}`);
        this.userService.changeStatusOnLine(userId);
    }
    startGame(roomId) {
        this.pongServices[roomId].startGame();
        this.frameIntervals[roomId] = setInterval(() => {
            const frame = this.pongServices[roomId].getFrame();
            this.sendFrameToRoom(roomId, frame);
        }, 1000 / FPS);
    }
    sendFrameToRoom(roomId, frame) {
        this.server.to(roomId).emit('sendFrames', frame);
    }
    handleMovePaddle(client, data) {
        const { player, direction, roomId } = data;
        if (!this.pongServices[roomId]) {
            console.error(`No PongService found for roomId ${roomId}`);
            return;
        }
        this.pongServices[roomId].updateFrame(player, direction === 'ArrowUp' ? 'up' : 'down');
    }
    handleGetFrame(client, roomId) {
        this.pongServices[roomId].updateFrameLogic();
        const frame = this.pongServices[roomId].getFrame();
        return frame;
    }
    handleStartGame(client, roomId) {
        this.pongServices[roomId].startGame();
        const updatedFrame = this.pongServices[roomId].getFrame();
        this.sendFrameToRoom(roomId, updatedFrame);
    }
    handleResetGame(client, data) {
        const { userId } = data;
        const roomId = client.rooms[0];
        clearInterval(this.frameIntervals[roomId]);
        delete this.pongServices[roomId];
        delete this.frameIntervals[roomId];
        delete this.waitingForSecondPlayer[roomId];
        delete this.secondPlayerIds[roomId];
        this.userService.changeStatusOnLine(userId);
        client.leave(roomId);
    }
    handleSendInvitation(client, data) {
        const { player_one_id, player_one_nickname, player_two, room } = data;
        this.server.emit('receiveInvitation', {
            player_one_id,
            player_one_nickname,
            player_two,
            room,
        });
    }
    handleCancelInvitation(client, data) {
        const { player_two, room } = data;
        this.server.emit('cancelInvitation', { player_two, room });
    }
    handleDeclineInvitation(client, data) {
        const { player_one, player_two, room } = data;
        this.server.emit('declineInvitation', { player_one, player_two, room });
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], PongGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('createRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], PongGateway.prototype, "handleCreateRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Array]),
    __metadata("design:returntype", void 0)
], PongGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], PongGateway.prototype, "handleLeaveRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('movePaddle'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], PongGateway.prototype, "handleMovePaddle", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getFrame'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], PongGateway.prototype, "handleGetFrame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('startGame'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], PongGateway.prototype, "handleStartGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('resetGame'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], PongGateway.prototype, "handleResetGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendInvitation'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], PongGateway.prototype, "handleSendInvitation", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('cancelInvitation'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], PongGateway.prototype, "handleCancelInvitation", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('declineInvitation'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], PongGateway.prototype, "handleDeclineInvitation", null);
PongGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ namespace: 'game', cors: { origin: '*' } }),
    __metadata("design:paramtypes", [user_service_1.UserService])
], PongGateway);
exports.PongGateway = PongGateway;
//# sourceMappingURL=pong.gateway.js.map