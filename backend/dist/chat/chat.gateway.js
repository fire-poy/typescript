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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const chat_service_1 = require("./chat.service");
const socket_io_1 = require("socket.io");
const create_message_dto_1 = require("./dto/create-message.dto");
const create_channel_dto_1 = require("./dto/create-channel.dto");
const common_1 = require("@nestjs/common");
const websockets_2 = require("@nestjs/websockets");
const typeorm_1 = require("@nestjs/typeorm");
const channel_entity_1 = require("../typeorm/channel.entity");
const typeorm_2 = require("typeorm");
let ChatGateway = class ChatGateway {
    constructor(chatService, channelRepository) {
        this.chatService = chatService;
        this.channelRepository = channelRepository;
        this.loger = new common_1.Logger('ChatGateway');
    }
    afterInit(server) {
        this.loger.log('Chat Socket initialized');
    }
    handleConnection(client, ...args) {
        this.loger.log(`Client chat socket connected: ${client.id}`);
    }
    handleDisconnect(client) {
        this.loger.log(`Client  chat socket disconnected: ${client.id}`);
    }
    async postMsg(createMessageDto) {
        try {
            await this.chatService.newMsg(createMessageDto);
            await this.chatService.findAllMsgByChannel(createMessageDto.channelId);
            this.server.emit('reload', {});
        }
        catch (error) {
            console.log('Error while posting message');
        }
    }
    async findAllMsgByChannel(channelId) {
        try {
            const chanAllMsgs = await this.chatService.findAllMsgByChannel(channelId);
            return chanAllMsgs;
        }
        catch (error) {
            console.log('Error while finding all messages by channel');
        }
    }
    async findAllUsersByChannel(channelId) {
        try {
            return await this.chatService.findUsersByChannel(channelId);
        }
        catch (error) {
            console.log('Error while finding users by channel');
        }
    }
    async blockUser(data) {
        const [userId, targetId] = data;
        try {
            await this.chatService.blockUser(userId, targetId);
            this.server.emit('reload', {});
        }
        catch (error) {
            console.log('Failed to block user');
        }
    }
    async unblockUser(data) {
        const [userId, targetId] = data;
        try {
            await this.chatService.unblockUser(userId, targetId);
            this.server.emit('reload', {});
        }
        catch (error) {
            console.log('Failed to unblock user');
        }
    }
    async getBlockedUsers(myId) {
        try {
            const blockedUsers = await this.chatService.getBlockedUsers(myId);
            return blockedUsers;
        }
        catch (error) {
            console.log('Failed to get blocked users');
        }
    }
    async setAdmin(data) {
        const [userId, targetId, channelId] = data;
        try {
            await this.chatService.setAdmin(userId, targetId, channelId);
            this.server.emit('reloadUsers', {});
        }
        catch (error) {
            console.log('Failed to set admin');
        }
    }
    async unsetAdmin(data) {
        const [userId, targetId, channelId] = data;
        try {
            await this.chatService.unsetAdmin(userId, targetId, channelId);
            this.server.emit('reloadUsers', {});
        }
        catch (error) {
            console.log('Failed to unset admin');
        }
    }
    async kickUser(data) {
        const [userId, targetId, channelId] = data;
        try {
            await this.chatService.kickUser(userId, targetId, channelId);
            this.server.emit('reload', {});
        }
        catch (error) {
            console.log('Failed to kick user');
        }
    }
    async banUser(data) {
        const [userId, targetId, channelId] = data;
        try {
            await this.chatService.banUser(userId, targetId, channelId);
            this.server.emit('reload', {});
        }
        catch (error) {
            console.log('Failed to ban user');
        }
    }
    async unbanUser(data) {
        const [userId, targetId, channelId] = data;
        try {
            await this.chatService.unbanUser(userId, targetId, channelId);
            this.server.emit('reload', {});
        }
        catch (error) {
            console.log('Failed to unban user');
        }
    }
    async getBannedUsers(channelId) {
        try {
            return await this.chatService.getBannedUsers(channelId);
        }
        catch (error) {
            console.log('Failed to get banned users');
        }
    }
    async muteUser(data) {
        const [userId, targetId, channelId] = data;
        try {
            await this.chatService.muteUser(userId, targetId, channelId);
            this.server.emit('reloadUsers', {});
        }
        catch (error) {
            console.log('Failed to mute user');
        }
    }
    async getMutedUsers(channelId) {
        try {
            return await this.chatService.getMutedUsers(channelId);
        }
        catch (error) {
            console.log('Failed to get muted users');
        }
    }
    async createChannel(createChannelDto) {
        try {
            if ((createChannelDto === null || createChannelDto === void 0 ? void 0 : createChannelDto.password) !== '' &&
                (createChannelDto === null || createChannelDto === void 0 ? void 0 : createChannelDto.password.length) > 8) {
                throw new Error('Password is longer than 8 characters');
            }
            else if (createChannelDto.name.length > 8) {
                throw new Error('Channel name is longer than 8 characters');
            }
            const channel = await this.channelRepository.findOne({
                where: { name: createChannelDto.name },
            });
            if (channel) {
                return { channelId: 0, error: 'Channel already exists' };
            }
            const channelCreated = await this.chatService.createChannel(createChannelDto);
            this.server.emit('reloadChannels', {});
            return { channelId: channelCreated.id };
        }
        catch (error) {
            console.log('Failed to create channel', error);
        }
    }
    async createDirectChannel(body) {
        const [userId, targetId] = body;
        const channel = await this.chatService.createChanDM(userId, targetId);
        this.server.emit('reloadChannels', channel);
        return channel;
    }
    async getAllChannels() {
        try {
            return await this.chatService.getAllChannels();
        }
        catch (error) {
            console.log('Failed to get all channels');
        }
    }
    async joinChannel(data) {
        const [channelId, userId, password] = data;
        if (password !== '' && password.length > 8)
            return;
        try {
            const channel = await this.chatService.joinChannel(channelId, userId, password);
            this.server.emit('reload', {});
            return channel;
        }
        catch (error) {
            console.log('Failed to join Channel');
        }
    }
    async leaveChannel(data) {
        const [channelId, userId] = data;
        try {
            const channel = await this.chatService.leaveChannel(channelId, userId);
            this.server.emit('reloadUsers', {});
            return channel;
        }
        catch (error) {
            console.log('Failed to remove user from channel');
        }
    }
    async deleteChannel(data) {
        const [channelId, userId] = data;
        try {
            const channel = await this.chatService.deleteChannel(channelId, userId);
            this.server.emit('reload', {});
            return channel;
        }
        catch (error) {
            console.log('Failed to remove user from channel');
        }
    }
    async changeChannelPassword(data) {
        const [channelId, password] = data;
        if (password !== '' && password.length > 8)
            return;
        try {
            return await this.chatService.changePassword(channelId, password);
        }
        catch (error) {
            console.log('Failed to change password');
        }
    }
};
__decorate([
    (0, websockets_2.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('postMsg'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_message_dto_1.CreateMessageDto]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "postMsg", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('findAllMsgByChannel'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "findAllMsgByChannel", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('findUsersByChannel'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "findAllUsersByChannel", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('blockUser'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "blockUser", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('unblockUser'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "unblockUser", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getBlockedUsers'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "getBlockedUsers", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('setAdmin'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "setAdmin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('unsetAdmin'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "unsetAdmin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('kickUser'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "kickUser", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('banUser'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "banUser", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('unbanUser'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "unbanUser", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getBannedUsers'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "getBannedUsers", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('muteUser'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "muteUser", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getMutedUsers'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "getMutedUsers", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('createNewChannel'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_channel_dto_1.CreateChannelDto]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "createChannel", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('createDM'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "createDirectChannel", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getAllChannels'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "getAllChannels", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinChannel'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "joinChannel", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveChannel'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "leaveChannel", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('deleteChannel'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "deleteChannel", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('changePassword'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "changeChannelPassword", null);
ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ namespace: 'chat', cors: { origin: '*' } }),
    __param(1, (0, typeorm_1.InjectRepository)(channel_entity_1.Channel)),
    __metadata("design:paramtypes", [chat_service_1.ChatService,
        typeorm_2.Repository])
], ChatGateway);
exports.ChatGateway = ChatGateway;
//# sourceMappingURL=chat.gateway.js.map