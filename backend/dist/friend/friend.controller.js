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
exports.FriendController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const friend_service_1 = require("./friend.service");
const update_friend_dto_1 = require("./dto/update-friend.dto");
const swagger_1 = require("@nestjs/swagger");
let FriendController = class FriendController {
    constructor(friendService) {
        this.friendService = friendService;
    }
    async create(req, id) {
        try {
            await this.friendService.create(req, +id);
            return { 'Friendship request successfully submitted': 'true' };
        }
        catch (error) {
            throw new common_1.BadRequestException();
        }
    }
    async accept(id, updateFriendDto) {
        try {
            await this.friendService.accept(+id, updateFriendDto);
            return { 'Friendship successfully accepted': 'true' };
        }
        catch (error) {
            throw new common_1.BadRequestException();
        }
    }
    async remove(id) {
        try {
            await this.friendService.remove(+id);
            return { 'Friendship successfully removed': 'true' };
        }
        catch (error) {
            throw new common_1.BadRequestException();
        }
    }
};
__decorate([
    (0, common_1.Post)('create/:id'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FriendController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)('accept/:id'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_friend_dto_1.UpdateFriendDto]),
    __metadata("design:returntype", Promise)
], FriendController.prototype, "accept", null);
__decorate([
    (0, common_1.Delete)('delete/:id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FriendController.prototype, "remove", null);
FriendController = __decorate([
    (0, swagger_1.ApiTags)('friend'),
    (0, common_1.Controller)('friend'),
    __metadata("design:paramtypes", [friend_service_1.FriendService])
], FriendController);
exports.FriendController = FriendController;
//# sourceMappingURL=friend.controller.js.map