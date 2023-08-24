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
exports.RoomService = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../typeorm/user.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const create_room_dto_1 = require("./dto/create-room.dto");
const user_service_1 = require("../user/user.service");
const uuid_1 = require("uuid");
let RoomService = class RoomService {
    constructor(userRepository, userService) {
        this.userRepository = userRepository;
        this.userService = userService;
        this.rooms = [];
    }
    getAllRooms() {
        return this.rooms;
    }
    getRoomById(id) {
        return this.rooms.find((room) => room.player_one === id || room.player_two === id);
    }
    async createRoom(req, createRoomDto) {
        var _a;
        const userMe = await this.userRepository.findOneBy({ id: req.user.id });
        if (!userMe) {
            throw new common_1.NotFoundException('User not found');
        }
        if (userMe.status === 'playing') {
            throw new Error('You are already playing');
        }
        this.userService.changeStatusPlaying(userMe.id);
        const room = {
            player_one: userMe.id,
            player_two: (_a = createRoomDto.player_two) !== null && _a !== void 0 ? _a : 0,
            theme: createRoomDto.theme,
            room_id: (0, uuid_1.v4)(),
        };
        this.rooms.push(room);
        return room;
    }
    updateRoom(id, updatedRoom) {
        const index = this.rooms.findIndex((room) => room.player_one === id || room.player_two === id);
        if (index !== -1) {
            this.rooms[index] = Object.assign(Object.assign({}, this.rooms[index]), updatedRoom);
            return this.rooms[index];
        }
        return null;
    }
    printRooms(rooms) {
        console.log('List of rooms:');
        rooms.forEach((room, index) => {
            console.log(`Room ${index + 1}:`);
            console.log(`Player One: ${room.player_one}`);
            console.log(`Player Two: ${room.player_two}`);
            console.log(`Theme: ${room.theme}`);
            console.log(`Room ID: ${room.room_id}`);
            console.log('---------------------');
        });
    }
    deleteRoom(room_id) {
        const index = this.rooms.findIndex((room) => room.room_id === room_id);
        if (index !== -1) {
            return this.rooms.splice(index, 1)[0];
        }
        throw new Error('Room not found');
    }
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    async joinRandomRoom(req) {
        const userMe = await this.userRepository.findOneBy({ id: req.user.id });
        if (!userMe) {
            throw new Error('User not found');
        }
        const myId = userMe.id;
        if (userMe.status === 'playing') {
            throw new Error('You are already playing');
        }
        this.userService.changeStatusPlaying(myId);
        let index = -1;
        let i = 0;
        while (i < 10 && index === -1) {
            index = this.rooms.findIndex((room) => room.player_two === 0);
            if (index !== -1) {
                this.rooms[index].player_two = myId;
                return this.rooms[index];
            }
            await this.sleep(1000);
            i++;
        }
        this.userService.changeStatusOnLine(myId);
    }
};
__decorate([
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_room_dto_1.CreateRoomDto]),
    __metadata("design:returntype", Promise)
], RoomService.prototype, "createRoom", null);
RoomService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        user_service_1.UserService])
], RoomService);
exports.RoomService = RoomService;
//# sourceMappingURL=room.service.js.map