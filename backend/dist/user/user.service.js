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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../typeorm/user.entity");
const typeorm_2 = require("typeorm");
const update_nickname_dto_1 = require("./dto/update-nickname.dto");
const uuid_1 = require("uuid");
const path_1 = require("path");
const fs = require("fs");
const friend_service_1 = require("../friend/friend.service");
const user_entity_2 = require("../typeorm/user.entity");
const friend_entity_1 = require("../typeorm/friend.entity");
const channel_entity_1 = require("../typeorm/channel.entity");
let UserService = class UserService {
    constructor(userRepository, friendService, friendRepository, channelRepository) {
        this.userRepository = userRepository;
        this.friendService = friendService;
        this.friendRepository = friendRepository;
        this.channelRepository = channelRepository;
    }
    create(createUserDto) {
        try {
            const user = this.userRepository.create(createUserDto);
            return this.userRepository.save(user);
        }
        catch (error) {
            console.log(error);
        }
    }
    findAll() {
        try {
            return this.userRepository.find();
        }
        catch (error) {
            console.log(error);
        }
    }
    findOne(id) {
        const user = this.userRepository.findOneBy({ id: id });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async update(id, updateUserDto) {
        try {
            const user = await this.findOne(id);
            return this.userRepository.save(Object.assign(Object.assign({}, user), updateUserDto));
        }
        catch (error) {
            console.log(error);
        }
    }
    async remove(id) {
        try {
            const user = await this.findOne(id);
            return this.userRepository.remove(user);
        }
        catch (error) {
            console.log(error);
        }
    }
    findByFT_id(FT_id) {
        try {
            return this.userRepository.findOneBy({ FT_id: FT_id });
        }
        catch (error) {
            console.log(error);
        }
    }
    async findByNickname(nickname) {
        try {
            const user = await this.userRepository.findOneBy({
                nickname: nickname,
            });
            return user;
        }
        catch (error) {
            console.error('Error when searching for the user: ', error);
        }
    }
    async getUserRankingPosition(userId) {
        try {
            const user = await this.findOne(userId);
            if (!user) {
                console.log('User not found');
            }
            const userPosition = await this.userRepository
                .createQueryBuilder('user')
                .where('user.xp >= :userXp', { userXp: user.xp })
                .getCount();
            return userPosition;
        }
        catch (error) {
            console.log(error);
        }
    }
    async setTwoFactorAuthenticationSecret(secret, userID) {
        try {
            const user = await this.userRepository.findOne({
                where: { id: userID },
            });
            if (user) {
                user.TFASecret = secret;
                return this.userRepository.save(user);
            }
            console.log(`User with id ${userID} not found`);
        }
        catch (error) {
            console.log(error);
        }
    }
    async turnOnTwoFactorAuthentication(userID) {
        try {
            const user = await this.userRepository.findOne({
                where: { id: userID },
            });
            if (user) {
                user.TFAEnabled = true;
                return this.userRepository.save(user);
            }
            console.log(`User with id ${userID} not found`);
        }
        catch (error) {
            console.log(error);
        }
    }
    async turnOffTwoFactorAuthentication(userID) {
        try {
            const user = await this.userRepository.findOne({
                where: { id: userID },
            });
            if (user) {
                user.TFAEnabled = false;
                return this.userRepository.save(user);
            }
            console.log(`User with id ${userID} not found`);
        }
        catch (error) {
            console.log(error);
        }
    }
    async getLambdaInfo(nickname) {
        try {
            const user = await this.findByNickname(nickname);
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            const { TFASecret, FT_id } = user, rest = __rest(user, ["TFASecret", "FT_id"]);
            const userPosition = await this.getUserRankingPosition(user.id);
            return Object.assign(Object.assign({}, rest), { userPosition });
        }
        catch (error) {
            console.log(error);
        }
    }
    async updateNickname(req, updateNicknameDto) {
        try {
            const user = await this.findOne(req.user.id);
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            const { nickname } = updateNicknameDto;
            if ((await this.findByNickname(nickname)) != null)
                return { error: 'Nickname already exists' };
            const updateUserDto = {
                id: user.id,
                nickname: nickname,
            };
            this.update(user.id, updateUserDto);
            return { message: 'Nickname updated successfully' };
        }
        catch (error) {
            return console.log('Failed to update nickname');
        }
    }
    logStatus(req) {
        if (req.user && req.session.needTFA === false) {
            return { status: 'isLogged' };
        }
        else if (req.user && req.session.needTFA === true) {
            return { status: 'need2fa' };
        }
        else {
            return { status: 'error', message: 'Not authenticated' };
        }
    }
    async uploadProfilePicture(req, file) {
        if (!file) {
            console.log('No image was provided');
        }
        const destinationPath = '/app/profile-images';
        const uniqueSuffix = (0, uuid_1.v4)();
        const fileExt = (0, path_1.extname)(file.originalname);
        const fileNameWithoutExtAndSpaces = (0, path_1.basename)(file.originalname, fileExt).replace(/\s+/g, '_');
        const uniqueFilename = `${fileNameWithoutExtAndSpaces}${uniqueSuffix}${fileExt}`;
        try {
            const fileData = fs.readFileSync(file.path);
            fs.writeFileSync(`${destinationPath}/${uniqueFilename}`, fileData);
            fs.unlinkSync(file.path);
            const serverBaseUrl = `${process.env.URL_BACKEND}/api/user`;
            const photoUrl = `${serverBaseUrl}/profile-images/${uniqueFilename}`;
            const user = await this.findOne(req.user.id);
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            const updateUserDto = {
                id: user.id,
                avatarUrl: photoUrl,
            };
            await this.update(user.id, updateUserDto);
            return photoUrl;
        }
        catch (error) {
            console.error('Error when moving profile image:', error);
        }
    }
    async getMyInfo(req) {
        const user = await this.findOne(req.user.id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const { TFASecret, FT_id } = user, rest = __rest(user, ["TFASecret", "FT_id"]);
        const userPosition = await this.getUserRankingPosition(req.user.id);
        return Object.assign(Object.assign({}, rest), { userPosition });
    }
    async getFriendsAndRequests(req) {
        const user = await this.findOne(req.user.id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return this.friendService.getFiendsAndRequests(user.id);
    }
    async getAllUsersWithNoFriendship(req) {
        const user = await this.findOne(req.user.id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const userId = user.id;
        const friendsAddedByMe = await this.friendRepository
            .createQueryBuilder('friend')
            .select('friend.friendId', 'friendId')
            .where('friend.userId = :userId', { userId })
            .getRawMany();
        const friendsWhoAddedMe = await this.friendRepository
            .createQueryBuilder('follower')
            .select('follower.userId', 'userId')
            .where('follower.friendId = :userId', { userId })
            .getRawMany();
        const friendsByMeIds = friendsAddedByMe.map((friend) => friend.friendId);
        const friendsByOthersIds = friendsWhoAddedMe.map((follower) => follower.userId);
        const usersNotFriends = await this.userRepository.find({
            where: {
                id: (0, typeorm_2.Not)((0, typeorm_2.In)([...friendsByMeIds, ...friendsByOthersIds, userId])),
            },
            select: ['id', 'nickname', 'avatarUrl'],
        });
        if (!usersNotFriends) {
            throw new common_1.NotFoundException('Users not found');
        }
        return { usersNotFriends };
    }
    async logout(req, res) {
        try {
            const user = await this.findOne(req.user.id);
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            this.update(user.id, { id: user.id, status: user_entity_2.UserStatus.Offline });
            await req.session.destroy();
            res.clearCookie('sessionID');
            res.status(200).json({ message: 'Logout successful' });
        }
        catch (error) {
            console.log(error);
        }
    }
    async changeStatusOnLine(userId) {
        try {
            const user = await this.findOne(userId);
            if (user && user.status != user_entity_2.UserStatus.Online)
                this.update(userId, { id: userId, status: user_entity_2.UserStatus.Online });
        }
        catch (error) {
            console.log(error);
        }
    }
    async changeStatusPlaying(userId) {
        try {
            const user = await this.findOne(userId);
            if (user && user.status != user_entity_2.UserStatus.Playing)
                this.update(userId, { id: userId, status: user_entity_2.UserStatus.Playing });
        }
        catch (error) {
            console.log(error);
        }
    }
    async isBlockedByMe(req, target_id) {
        try {
            const user = await this.userRepository.findOne({
                where: { id: req.user.id },
                relations: {
                    blockedUsers: true,
                },
            });
            if (user.blockedUsers.some((u) => u.id === target_id))
                return true;
            else
                return false;
        }
        catch (error) {
            console.log(error);
        }
    }
    async blockUser(monId, targetId) {
        try {
            const user = await this.userRepository.findOne({
                where: { id: monId },
                relations: {
                    blockedUsers: true,
                },
            });
            if (!user)
                throw new common_1.NotFoundException('User not found');
            const userToBlock = await this.userRepository.findOne({
                where: { id: targetId },
                relations: {
                    blockedBy: true,
                },
            });
            if (!userToBlock)
                throw new common_1.NotFoundException('User not found');
            userToBlock.blockedBy.push(user);
            await this.userRepository.save(userToBlock);
            user.blockedUsers.push(userToBlock);
            await this.userRepository.save(user);
            let channelName = user.nickname + ' & ' + userToBlock.nickname;
            let DM = await this.channelRepository.findOne({
                where: { name: channelName },
            });
            if (!DM) {
                channelName = userToBlock.nickname + ' & ' + user.nickname;
                let DM = await this.channelRepository.findOne({
                    where: { name: channelName },
                });
                if (!DM) {
                    channelName = userToBlock.nickname + ' & ' + user.nickname;
                    let DM = await this.channelRepository.findOne({
                        where: { name: channelName },
                    });
                }
                if (DM) {
                    await this.channelRepository.remove(DM);
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async unblockUser(myId, hisId) {
        try {
            const user = await this.userRepository.findOne({
                where: { id: myId },
                relations: {
                    blockedUsers: true,
                },
            });
            const userToUnblock = await this.userRepository.findOne({
                where: { id: hisId },
                relations: {
                    blockedBy: true,
                },
            });
            userToUnblock.blockedBy = userToUnblock.blockedBy.filter((u) => u.id !== user.id);
            await this.userRepository.save(userToUnblock);
            user.blockedUsers = user.blockedUsers.filter((u) => u.id !== userToUnblock.id);
            await this.userRepository.save(user);
        }
        catch (error) {
            console.log(error);
        }
    }
    async updatePlayersStats(updatePlayersStatsDto) {
        let winner = await this.findOne(updatePlayersStatsDto.winner);
        winner.nbVictory += 1;
        winner.totalPlay += 1;
        winner.xp += 50;
        this.update(winner.id, winner);
        let loser = await this.findOne(updatePlayersStatsDto.loser);
        loser.totalPlay += 1;
        loser.xp += 25;
        this.update(loser.id, loser);
    }
};
__decorate([
    __param(0, (0, common_1.Param)('nickname')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserService.prototype, "getLambdaInfo", null);
__decorate([
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_nickname_dto_1.UpdateNicknameDto]),
    __metadata("design:returntype", Promise)
], UserService.prototype, "updateNickname", null);
__decorate([
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserService.prototype, "logStatus", null);
__decorate([
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserService.prototype, "uploadProfilePicture", null);
__decorate([
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserService.prototype, "getMyInfo", null);
__decorate([
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserService.prototype, "getFriendsAndRequests", null);
__decorate([
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserService.prototype, "getAllUsersWithNoFriendship", null);
__decorate([
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserService.prototype, "logout", null);
__decorate([
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], UserService.prototype, "isBlockedByMe", null);
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(friend_entity_1.Friend)),
    __param(3, (0, typeorm_1.InjectRepository)(channel_entity_1.Channel)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        friend_service_1.FriendService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map