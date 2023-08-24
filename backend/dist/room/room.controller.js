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
exports.RoomController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const room_service_1 = require("./room.service");
const swagger_1 = require("@nestjs/swagger");
const create_room_dto_1 = require("./dto/create-room.dto");
let RoomController = class RoomController {
    constructor(roomService) {
        this.roomService = roomService;
    }
    async createRoom(req, createRoomDto) {
        try {
            const room = await this.roomService.createRoom(req, createRoomDto);
            return room;
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.CONFLICT);
        }
    }
    async joinRoom(req) {
        try {
            const room = await this.roomService.joinRandomRoom(req);
            return room;
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.CONFLICT);
        }
    }
    deleteRoom(roomId) {
        try {
            return this.roomService.deleteRoom(roomId);
        }
        catch (error) {
            throw new common_1.NotFoundException();
        }
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    openapi.ApiResponse({ status: 201, type: require("../types/Room").Room }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_room_dto_1.CreateRoomDto]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "createRoom", null);
__decorate([
    (0, common_1.Post)('joinroom/random'),
    openapi.ApiResponse({ status: 201, type: require("../types/Room").Room }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "joinRoom", null);
__decorate([
    (0, common_1.Delete)('id/:roomId'),
    openapi.ApiResponse({ status: 200, type: require("../types/Room").Room }),
    __param(0, (0, common_1.Param)('roomId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RoomController.prototype, "deleteRoom", null);
RoomController = __decorate([
    (0, swagger_1.ApiTags)('room'),
    (0, common_1.Controller)('room'),
    __metadata("design:paramtypes", [room_service_1.RoomService])
], RoomController);
exports.RoomController = RoomController;
//# sourceMappingURL=room.controller.js.map