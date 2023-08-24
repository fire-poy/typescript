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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const create_channel_dto_1 = require("./dto/create-channel.dto");
const create_channel_user_muted_dto_1 = require("./dto/create-channel-user-muted.dto");
const typeorm_1 = require("@nestjs/typeorm");
const message_entity_1 = require("../typeorm/message.entity");
const channel_entity_1 = require("../typeorm/channel.entity");
const user_entity_1 = require("../typeorm/user.entity");
const channel_user_muted_entity_1 = require("../typeorm/channel-user-muted.entity");
const typeorm_2 = require("typeorm");
const common_2 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const ChannelTypes_1 = require("../types/ChannelTypes");
let ChatService = class ChatService {
    constructor(messageRepository, channelRepository, userRepository, channelUserMutedRepository) {
        this.messageRepository = messageRepository;
        this.channelRepository = channelRepository;
        this.userRepository = userRepository;
        this.channelUserMutedRepository = channelUserMutedRepository;
    }
    async newMsg(createMessageDto) {
        const user = await this.userRepository.findOneBy({
            id: createMessageDto.creator,
        });
        const { nickname, avatarUrl } = user;
        createMessageDto.userNickname = nickname;
        createMessageDto.userAvatarUrl = avatarUrl;
        const newMessage = this.messageRepository.create(createMessageDto);
        return await this.messageRepository.save(newMessage);
    }
    async findOneToDisplay(id) {
        const message = await this.messageRepository
            .createQueryBuilder('message')
            .select([
            'message.id',
            'message.content',
            'user.nickname',
            'user.avatarUrl',
            'message.creator',
        ])
            .where('message.id = :id', { id })
            .getOne();
        return message;
    }
    async findAllMsgByChannel(channelId) {
        const messages = await this.messageRepository
            .createQueryBuilder('message')
            .where('message.channelId = :channelId', { channelId })
            .getMany();
        return messages;
    }
    async findUsersByChannel(id) {
        return await this.channelRepository.findOne({
            relations: {
                users: true,
                owner: true,
                admin: true,
                banned: true,
            },
            where: { id: id },
        });
    }
    async blockUser(userId, targetId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: {
                blockedUsers: true,
            },
        });
        const userToBlock = await this.userRepository.findOne({
            where: { id: targetId },
            relations: {
                blockedBy: true,
            },
        });
        userToBlock.blockedBy.push(user);
        await this.userRepository.save(userToBlock);
        user.blockedUsers.push(userToBlock);
        await this.userRepository.save(user);
        const directChan = await this.findChanDM(userId, targetId);
        if (directChan) {
            await this.channelRepository.remove(directChan);
        }
    }
    async unblockUser(myId, hisId) {
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
    async getBlockedUsers(myId) {
        const user = await this.userRepository.findOne({
            where: { id: myId },
            relations: {
                blockedUsers: true,
            },
        });
        const blockedUserIds = user.blockedUsers.map((blockedUser) => blockedUser.id);
        return blockedUserIds;
    }
    async isBlockedBy(myId, targetId) {
        const user = await this.userRepository.findOne({
            where: { id: myId },
            relations: {
                blockedBy: true,
            },
        });
        if (user.blockedBy.some((u) => u.id === targetId))
            return true;
        else
            return false;
    }
    async setAdmin(userId, targetId, channelId) {
        const channel = await this.channelRepository.findOne({
            where: { id: channelId },
            relations: {
                owner: true,
                admin: true,
            },
        });
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        const userToSet = await this.userRepository.findOne({
            where: { id: targetId },
        });
        if (channel.owner.id === user.id) {
            channel.admin.push(userToSet);
            await this.channelRepository.save(channel);
        }
        else {
            throw new common_2.UnauthorizedException();
        }
    }
    async unsetAdmin(userId, targetId, channelId) {
        const channel = await this.channelRepository.findOne({
            where: { id: channelId },
            relations: {
                owner: true,
                admin: true,
            },
        });
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        const userToUnset = await this.userRepository.findOne({
            where: { id: targetId },
        });
        if (channel.owner.id === user.id) {
            channel.admin = channel.admin.filter((u) => u.id !== userToUnset.id);
            await this.channelRepository.save(channel);
        }
        else {
            throw new common_2.UnauthorizedException();
        }
    }
    async kickUser(userId, targetId, channelId) {
        const channel = await this.channelRepository.findOne({
            where: { id: channelId },
            relations: {
                owner: true,
                admin: true,
                users: true,
            },
        });
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        const userToKick = await this.userRepository.findOne({
            where: { id: targetId },
        });
        if (channel.owner.id !== userToKick.id &&
            channel.admin.some((u) => u.id === user.id)) {
            channel.users = channel.users.filter((u) => u.id !== userToKick.id);
            await this.channelRepository.save(channel);
        }
        else
            throw new common_2.UnauthorizedException();
    }
    async banUser(userId, targetId, channelId) {
        const channel = await this.channelRepository.findOne({
            where: { id: channelId },
            relations: {
                owner: true,
                admin: true,
                users: true,
                banned: true,
            },
        });
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        const userToBan = await this.userRepository.findOne({
            where: { id: targetId },
        });
        if (channel.owner.id !== userToBan.id &&
            channel.admin.some((u) => u.id === user.id)) {
            channel.banned.push(userToBan);
            channel.users = channel.users.filter((u) => u.id !== userToBan.id);
            channel.admin = channel.admin.filter((u) => u.id !== userToBan.id);
            await this.channelRepository.save(channel);
        }
        else
            throw new common_2.UnauthorizedException();
    }
    async unbanUser(userId, targetId, channelId) {
        const channel = await this.channelRepository.findOne({
            where: { id: channelId },
            relations: {
                admin: true,
                users: true,
                banned: true,
            },
        });
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        const userToUnban = await this.userRepository.findOne({
            where: { id: targetId },
        });
        if (channel.admin.some((u) => u.id === user.id)) {
            channel.banned = channel.banned.filter((u) => u.id !== userToUnban.id);
            await this.channelRepository.save(channel);
        }
        else
            throw new common_2.UnauthorizedException();
    }
    async getBannedUsers(channelId) {
        const channel = await this.channelRepository.findOne({
            where: { id: channelId },
            relations: {
                banned: true,
            },
        });
        const bannedUserIds = channel.banned.map((bannedUser) => bannedUser.id);
        return bannedUserIds;
    }
    async muteUser(userId, targetId, channelId) {
        const channel = await this.channelRepository.findOne({
            where: { id: channelId },
            relations: {
                owner: true,
                admin: true,
            },
        });
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        const userToMute = await this.userRepository.findOne({
            where: { id: targetId },
        });
        if (channel.owner.id !== userToMute.id &&
            channel.admin.some((u) => u.id === user.id)) {
            const isMuted = await this.channelUserMutedRepository.findOne({
                where: {
                    user: { id: userToMute.id },
                    channel: { id: channelId },
                },
            });
            if (isMuted)
                throw new common_2.BadRequestException('User is already muted');
            let chUserMuted = new create_channel_user_muted_dto_1.CreateChannelUserMutedDto();
            chUserMuted.user = userToMute;
            chUserMuted.channel = channel;
            this.channelUserMutedRepository.create(chUserMuted);
            await this.channelUserMutedRepository.save(chUserMuted);
        }
        else
            throw new common_2.UnauthorizedException();
    }
    async getMutedUsers(channelId) {
        const mutedUsers = await this.channelUserMutedRepository.find({
            where: { channel: { id: channelId } },
            relations: ['user'],
        });
        if (mutedUsers.length === 0)
            return [];
        const currentDate = new Date();
        mutedUsers.forEach(async (mutedUser) => {
            if (mutedUser.mutedAt.getTime() + 3600000 < currentDate.getTime()) {
                await this.channelUserMutedRepository.delete(mutedUser.id);
            }
        });
        const mutedUserIds = mutedUsers.map((mutedUser) => mutedUser.user.id);
        return mutedUserIds;
    }
    async createChannel(createChannelDto) {
        const user = await this.userRepository.findOneBy({
            id: createChannelDto.ownerId,
        });
        if (!user)
            throw new common_2.NotFoundException();
        const channel = await this.channelRepository.findOne({
            where: { name: createChannelDto.name },
        });
        if (channel)
            throw new common_2.BadRequestException();
        createChannelDto.owner = user;
        createChannelDto.admin = [user];
        createChannelDto.users = [user];
        createChannelDto.messages = [];
        if (createChannelDto === null || createChannelDto === void 0 ? void 0 : createChannelDto.password) {
            const PlainTextPassword = createChannelDto.password;
            createChannelDto.password = await bcrypt.hash(PlainTextPassword, 10);
        }
        const newChannel = this.channelRepository.create(createChannelDto);
        return this.channelRepository.save(newChannel);
    }
    async getAllChannels() {
        return await this.channelRepository.find({
            relations: ['users', 'admin', 'messages', 'owner'],
        });
    }
    async joinChannel(channelId, userId, password) {
        const channel = await this.channelRepository.findOne({
            relations: ['users', 'banned'],
            where: { id: channelId },
        });
        if (channel.type === ChannelTypes_1.default.Private) {
            const isSamePwd = await bcrypt.compare(password, channel.password);
            if (!isSamePwd) {
                throw new common_2.UnauthorizedException();
            }
        }
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (channel.banned.some((u) => u.id === user.id)) {
            throw new common_2.UnauthorizedException();
        }
        if (channel.type === 'direct') {
            if (channel.users.length === 1) {
                channel.users.push(user);
            }
            else {
                throw new common_2.UnauthorizedException();
            }
        }
        else
            channel.users.push(user);
        return await this.channelRepository.save(channel);
    }
    async leaveChannel(channelId, userId) {
        const channel = await this.channelRepository.findOne({
            relations: ['users'],
            where: { id: channelId },
        });
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        channel.users = channel.users.filter((u) => u.id !== user.id);
        return await this.channelRepository.save(channel);
    }
    async findChanDM(userId, TargetId) {
        const user = await this.userRepository.findOneBy({
            id: userId,
        });
        const target = await this.userRepository.findOneBy({
            id: TargetId,
        });
        let channelName = user.nickname + ' & ' + target.nickname;
        let channel = await this.channelRepository.findOne({
            where: { name: channelName },
        });
        if (!channel) {
            channelName = target.nickname + ' & ' + user.nickname;
            let channel = await this.channelRepository.findOne({
                where: { name: channelName },
            });
        }
        return channel;
    }
    async createChanDM(userId, TargetId) {
        const user = await this.userRepository.findOneBy({
            id: userId,
        });
        const target = await this.userRepository.findOneBy({
            id: TargetId,
        });
        if (await this.isBlockedBy(userId, TargetId))
            throw new common_2.BadRequestException('You are blocked by this user');
        else if (await this.isBlockedBy(TargetId, userId))
            throw new common_2.BadRequestException('Unblock this User to start chating');
        else {
            let channelName = user.nickname + ' & ' + target.nickname;
            let channel = await this.channelRepository.findOne({
                where: { name: channelName },
                relations: ['users'],
            });
            if (!channel) {
                channelName = target.nickname + ' & ' + user.nickname;
                let channel = await this.channelRepository.findOne({
                    where: { name: channelName },
                    relations: ['users'],
                });
            }
            if (channel) {
                if (channel.users.some((u) => u.id === user.id)) {
                    return channel;
                }
                else {
                    const joinChannel = await this.joinChannel(channel.id, userId, '');
                    return joinChannel;
                }
            }
            else {
                const createChannelDto = new create_channel_dto_1.CreateChannelDto();
                createChannelDto.owner = user;
                createChannelDto.admin = [user];
                createChannelDto.users = [user, target];
                createChannelDto.type = 'direct';
                createChannelDto.name = user.nickname + ' & ' + target.nickname;
                createChannelDto.password = '';
                const channelCreated = this.channelRepository.create(createChannelDto);
                return await this.channelRepository.save(channelCreated);
            }
        }
    }
    async deleteChannel(channelId, userId) {
        const channel = await this.channelRepository.findOne({
            where: { id: channelId },
        });
        if (!channel) {
            throw new common_2.NotFoundException('Channel not found');
        }
        return await this.channelRepository.remove(channel);
    }
    async changePassword(channelId, PlainTextPassword) {
        try {
            const chan = await this.channelRepository.findOne({
                where: { id: channelId },
            });
            chan.password = await bcrypt.hash(PlainTextPassword, 10);
            await this.channelRepository.update(channelId, chan);
            return true;
        }
        catch (error) {
            return false;
        }
    }
};
ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __param(1, (0, typeorm_1.InjectRepository)(channel_entity_1.Channel)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(channel_user_muted_entity_1.ChannelUserMuted)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ChatService);
exports.ChatService = ChatService;
//# sourceMappingURL=chat.service.js.map