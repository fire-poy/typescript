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
exports.UserController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const update_nickname_dto_1 = require("./dto/update-nickname.dto");
const uuid_1 = require("uuid");
const path_1 = require("path");
const public_decorator_1 = require("../decorators/public.decorator");
const update_player_stats_dto_1 = require("./dto/update-player-stats.dto");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async create(createUserDto) {
        try {
            return await this.userService.create(createUserDto);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException();
        }
    }
    async findOne(id) {
        try {
            return await this.userService.findOne(+id);
        }
        catch (error) {
            throw new common_1.NotFoundException();
        }
    }
    async getMyInfo(req) {
        try {
            return await this.userService.getMyInfo(req);
        }
        catch (error) {
            throw new common_1.NotFoundException();
        }
    }
    async getFriendsAndRequests(req) {
        try {
            return await this.userService.getFriendsAndRequests(req);
        }
        catch (error) {
            throw new common_1.NotFoundException();
        }
    }
    async getOtherUsers(req) {
        try {
            return await this.userService.getAllUsersWithNoFriendship(req);
        }
        catch (error) {
            throw new common_1.NotFoundException();
        }
    }
    async getLambda(nickname) {
        try {
            return await this.userService.getLambdaInfo(nickname);
        }
        catch (error) {
            throw new common_1.NotFoundException();
        }
    }
    async updateNickname(req, updateNicknameDto) {
        try {
            return await this.userService.updateNickname(req, updateNicknameDto);
        }
        catch (error) {
            throw new common_1.NotFoundException();
        }
    }
    async logout(req, res) {
        try {
            return await this.userService.logout(req, res);
        }
        catch (error) {
            throw new common_1.NotFoundException();
        }
    }
    async uploadProfilePicture(req, file) {
        if (!file) {
            console.log('No image was provided');
        }
        try {
            const photoUrl = await this.userService.uploadProfilePicture(req, file);
            return { message: 'Profile image saved correctly', photoUrl };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('An error occurred when saving the profile image');
        }
    }
    async getPhoto(filename, res) {
        res.sendFile(filename, { root: './uploads' });
    }
    async serveProfileImage(filename, res) {
        res.sendFile(filename, { root: '/app/profile-images' });
    }
    async isBlockedByMe(target_id, req) {
        try {
            return await this.userService.isBlockedByMe(req, +target_id);
        }
        catch (error) {
            console.log('Failed to get blocked User');
        }
    }
    async blockUser(target_id, req) {
        try {
            await this.userService.blockUser(req.user.id, +target_id);
            return { message: 'User blocked successfully' };
        }
        catch (error) {
            console.log('Failed to block user');
        }
    }
    async unblockUser(target_id, req) {
        try {
            await this.userService.unblockUser(req.user.id, +target_id);
            return { message: 'User unblocked successfully' };
        }
        catch (error) {
            console.log('Failed to unblock user');
        }
    }
    async updatePlayersStats(updatePlayersStatsDto) {
        try {
            await this.userService.updatePlayersStats(updatePlayersStatsDto);
            return { message: 'Players stats updated successfully' };
        }
        catch (error) {
            console.log('Failed to update players stats');
        }
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    openapi.ApiResponse({ status: 201, type: require("../typeorm/user.entity").User }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('id/:id'),
    openapi.ApiResponse({ status: 200, type: require("../typeorm/user.entity").User }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findOne", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('me'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getMyInfo", null);
__decorate([
    (0, common_1.Get)('getFriendsAndRequests'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getFriendsAndRequests", null);
__decorate([
    (0, common_1.Get)('getallnonfriendusers'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getOtherUsers", null);
__decorate([
    (0, common_1.Get)('nickname/:nickname'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('nickname')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getLambda", null);
__decorate([
    (0, common_1.Post)('updatenickname'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_nickname_dto_1.UpdateNicknameDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateNickname", null);
__decorate([
    (0, common_1.Post)('logout'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('upload-profile-picture'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('profilePicture', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/tmp-profil-pictures-storage',
            filename: (req, file, cb) => {
                const uniqueSuffix = (0, uuid_1.v4)();
                const fileExt = (0, path_1.extname)(file.originalname);
                cb(null, `${Date.now()}-${uniqueSuffix}${fileExt}`);
            },
        }),
    })),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "uploadProfilePicture", null);
__decorate([
    (0, common_1.Get)('picture/:filename'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getPhoto", null);
__decorate([
    (0, common_1.Get)('profile-images/:filename'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "serveProfileImage", null);
__decorate([
    (0, common_1.Get)('isBlockedByMe/:id'),
    openapi.ApiResponse({ status: 200, type: Boolean }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "isBlockedByMe", null);
__decorate([
    (0, common_1.Post)('block/:id'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "blockUser", null);
__decorate([
    (0, common_1.Delete)('unblock/:id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "unblockUser", null);
__decorate([
    (0, common_1.Post)('updatePlayersStats'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_player_stats_dto_1.UpdatePlayersStatsDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updatePlayersStats", null);
UserController = __decorate([
    (0, swagger_1.ApiTags)('user'),
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map