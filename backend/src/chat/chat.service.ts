import { Injectable } from '@nestjs/common'
import { CreateMessageDto } from './dto/create-message.dto'
import { CreateChannelDto } from './dto/create-channel.dto'
import { CreateChannelUserMutedDto } from './dto/create-channel-user-muted.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Message } from 'src/typeorm/message.entity'
import { Channel } from 'src/typeorm/channel.entity'
import { User } from 'src/typeorm/user.entity'
import { ChannelUserMuted } from 'src/typeorm/channel-user-muted.entity'
import { Repository } from 'typeorm'
import {
    NotFoundException,
    UnauthorizedException,
    BadRequestException,
} from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import ChannelType from 'src/types/ChannelTypes'

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,
        @InjectRepository(Channel)
        private readonly channelRepository: Repository<Channel>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(ChannelUserMuted)
        private readonly channelUserMutedRepository: Repository<ChannelUserMuted>
    ) {}

    async newMsg(createMessageDto: CreateMessageDto) {
        const user = await this.userRepository.findOneBy({
            id: createMessageDto.creator,
        })
        const { nickname, avatarUrl } = user
        createMessageDto.userNickname = nickname
        createMessageDto.userAvatarUrl = avatarUrl
        const newMessage = this.messageRepository.create(createMessageDto)
        return await this.messageRepository.save(newMessage)
    }

    async findOneToDisplay(id: number) {
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
            .getOne()
        return message
    }

    async findAllMsgByChannel(channelId: number): Promise<Message[]> {
        const messages = await this.messageRepository
            .createQueryBuilder('message')
            .where('message.channelId = :channelId', { channelId })
            .getMany()

        return messages
    }

    async findUsersByChannel(id: number) {
        return await this.channelRepository.findOne({
            relations: {
                users: true,
                owner: true,
                admin: true,
                banned: true,
            },
            where: { id: id },
        })
    }

    async blockUser(userId: number, targetId: number) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: {
                blockedUsers: true,
            },
        })
        const userToBlock = await this.userRepository.findOne({
            where: { id: targetId },
            relations: {
                blockedBy: true,
            },
        })

        userToBlock.blockedBy.push(user)
        await this.userRepository.save(userToBlock)

        user.blockedUsers.push(userToBlock)
        await this.userRepository.save(user)

        const directChan = await this.findChanDM(userId, targetId)
        if (directChan) {
            await this.channelRepository.remove(directChan)
        }
    }

    async unblockUser(myId: number, hisId: number) {
        const user = await this.userRepository.findOne({
            where: { id: myId },
            relations: {
                blockedUsers: true,
            },
        })

        const userToUnblock = await this.userRepository.findOne({
            where: { id: hisId },
            relations: {
                blockedBy: true,
            },
        })

        userToUnblock.blockedBy = userToUnblock.blockedBy.filter(
            (u) => u.id !== user.id
        )
        await this.userRepository.save(userToUnblock)

        user.blockedUsers = user.blockedUsers.filter(
            (u) => u.id !== userToUnblock.id
        )
        await this.userRepository.save(user)
    }

    async getBlockedUsers(myId: number) {
        const user = await this.userRepository.findOne({
            where: { id: myId },
            relations: {
                blockedUsers: true,
            },
        })
        const blockedUserIds = user.blockedUsers.map(
            (blockedUser) => blockedUser.id
        )
        return blockedUserIds
    }

    async isBlockedBy(myId: number, targetId: number) {
        const user = await this.userRepository.findOne({
            where: { id: myId },
            relations: {
                blockedBy: true,
            },
        })
        if (user.blockedBy.some((u) => u.id === targetId)) return true
        else return false
    }

    async setAdmin(userId: number, targetId: number, channelId: number) {
        const channel = await this.channelRepository.findOne({
            where: { id: channelId },
            relations: {
                owner: true,
                admin: true,
            },
        })
        const user = await this.userRepository.findOne({
            where: { id: userId },
        })

        const userToSet = await this.userRepository.findOne({
            where: { id: targetId },
        })

        if (channel.owner.id === user.id) {
            channel.admin.push(userToSet)
            await this.channelRepository.save(channel)
        } else {
            throw new UnauthorizedException()
        }
    }

    async unsetAdmin(userId: number, targetId: number, channelId: number) {
        const channel = await this.channelRepository.findOne({
            where: { id: channelId },
            relations: {
                owner: true,
                admin: true,
            },
        })
        const user = await this.userRepository.findOne({
            where: { id: userId },
        })

        const userToUnset = await this.userRepository.findOne({
            where: { id: targetId },
        })

        if (channel.owner.id === user.id) {
            channel.admin = channel.admin.filter((u) => u.id !== userToUnset.id)
            await this.channelRepository.save(channel)
        } else {
            throw new UnauthorizedException()
        }
    }

    async kickUser(userId: number, targetId: number, channelId: number) {
        const channel = await this.channelRepository.findOne({
            where: { id: channelId },
            relations: {
                owner: true,
                admin: true,
                users: true,
            },
        })

        const user = await this.userRepository.findOne({
            where: { id: userId },
        })

        const userToKick = await this.userRepository.findOne({
            where: { id: targetId },
        })

        if (
            channel.owner.id !== userToKick.id &&
            channel.admin.some((u) => u.id === user.id)
        ) {
            channel.users = channel.users.filter((u) => u.id !== userToKick.id)
            await this.channelRepository.save(channel)
        } else throw new UnauthorizedException()
    }

    async banUser(userId: number, targetId: number, channelId: number) {
        const channel = await this.channelRepository.findOne({
            where: { id: channelId },
            relations: {
                owner: true,
                admin: true,
                users: true,
                banned: true,
            },
        })

        const user = await this.userRepository.findOne({
            where: { id: userId },
        })

        const userToBan = await this.userRepository.findOne({
            where: { id: targetId },
        })

        if (
            channel.owner.id !== userToBan.id &&
            channel.admin.some((u) => u.id === user.id)
        ) {
            channel.banned.push(userToBan)
            channel.users = channel.users.filter((u) => u.id !== userToBan.id)
            channel.admin = channel.admin.filter((u) => u.id !== userToBan.id)
            await this.channelRepository.save(channel)
        } else throw new UnauthorizedException()
    }

    async unbanUser(userId: number, targetId: number, channelId: number) {
        const channel = await this.channelRepository.findOne({
            where: { id: channelId },
            relations: {
                admin: true,
                users: true,
                banned: true,
            },
        })

        const user = await this.userRepository.findOne({
            where: { id: userId },
        })

        const userToUnban = await this.userRepository.findOne({
            where: { id: targetId },
        })

        if (channel.admin.some((u) => u.id === user.id)) {
            channel.banned = channel.banned.filter(
                (u) => u.id !== userToUnban.id
            )
            await this.channelRepository.save(channel)
        } else throw new UnauthorizedException()
    }

    async getBannedUsers(channelId: number) {
        const channel = await this.channelRepository.findOne({
            where: { id: channelId },
            relations: {
                banned: true,
            },
        })
        const bannedUserIds = channel.banned.map((bannedUser) => bannedUser.id)
        return bannedUserIds
    }

    async muteUser(userId: number, targetId: number, channelId: number) {
        const channel = await this.channelRepository.findOne({
            where: { id: channelId },
            relations: {
                owner: true,
                admin: true,
            },
        })
        const user = await this.userRepository.findOne({
            where: { id: userId },
        })

        const userToMute = await this.userRepository.findOne({
            where: { id: targetId },
        })
        if (
            channel.owner.id !== userToMute.id &&
            channel.admin.some((u) => u.id === user.id)
        ) {
            const isMuted = await this.channelUserMutedRepository.findOne({
                where: {
                    user: { id: userToMute.id },
                    channel: { id: channelId },
                },
            })
            if (isMuted) throw new BadRequestException('User is already muted')
            let chUserMuted: CreateChannelUserMutedDto =
                new CreateChannelUserMutedDto()
            chUserMuted.user = userToMute
            chUserMuted.channel = channel
            this.channelUserMutedRepository.create(chUserMuted)
            await this.channelUserMutedRepository.save(chUserMuted)
        } else throw new UnauthorizedException()
    }

    async getMutedUsers(channelId: number) {
        const mutedUsers = await this.channelUserMutedRepository.find({
            where: { channel: { id: channelId } },
            relations: ['user'],
        })
        // delete all muted users that were muted more than 1 hour ago
        if (mutedUsers.length === 0) return []
        const currentDate = new Date()
        mutedUsers.forEach(async (mutedUser) => {
            if (mutedUser.mutedAt.getTime() + 3600000 < currentDate.getTime()) {
                await this.channelUserMutedRepository.delete(mutedUser.id)
            }
        })

        const mutedUserIds = mutedUsers.map((mutedUser) => mutedUser.user.id)
        return mutedUserIds
    }

    async createChannel(createChannelDto: CreateChannelDto) {
        const user = await this.userRepository.findOneBy({
            id: createChannelDto.ownerId,
        })
        if (!user) throw new NotFoundException()
        const channel = await this.channelRepository.findOne({
            where: { name: createChannelDto.name },
        })
        if (channel) throw new BadRequestException()
        createChannelDto.owner = user
        createChannelDto.admin = [user]
        createChannelDto.users = [user]
        createChannelDto.messages = []

        if (createChannelDto?.password) {
            const PlainTextPassword = createChannelDto.password
            createChannelDto.password = await bcrypt.hash(PlainTextPassword, 10)
        }
        const newChannel = this.channelRepository.create(createChannelDto)
        return this.channelRepository.save(newChannel)
    }

    async getAllChannels() {
        return await this.channelRepository.find({
            relations: ['users', 'admin', 'messages', 'owner'],
        })
    }

    async joinChannel(channelId: number, userId: number, password: string) {
        const channel = await this.channelRepository.findOne({
            relations: ['users', 'banned'],
            where: { id: channelId },
        })

        if (channel.type === ChannelType.Private) {
            const isSamePwd = await bcrypt.compare(password, channel.password)
            if (!isSamePwd) {
                throw new UnauthorizedException()
            }
        }
        const user = await this.userRepository.findOne({
            where: { id: userId },
        })
        if (channel.banned.some((u) => u.id === user.id)) {
            throw new UnauthorizedException()
        }
        if (channel.type === 'direct') {
            if (channel.users.length === 1) {
                channel.users.push(user)
            } else {
                throw new UnauthorizedException()
            }
        } else channel.users.push(user)
        return await this.channelRepository.save(channel)
    }

    async leaveChannel(channelId: number, userId: number) {
        const channel = await this.channelRepository.findOne({
            relations: ['users'],
            where: { id: channelId },
        })
        const user = await this.userRepository.findOne({
            where: { id: userId },
        })
        channel.users = channel.users.filter((u) => u.id !== user.id)
        return await this.channelRepository.save(channel)
    }

    async findChanDM(userId: number, TargetId: number) {
        const user = await this.userRepository.findOneBy({
            id: userId,
        })
        const target = await this.userRepository.findOneBy({
            id: TargetId,
        })

        let channelName = user.nickname + ' & ' + target.nickname
        let channel = await this.channelRepository.findOne({
            where: { name: channelName },
        })

        if (!channel) {
            channelName = target.nickname + ' & ' + user.nickname
            let channel = await this.channelRepository.findOne({
                where: { name: channelName },
            })
        }
        return channel
    }

    async createChanDM(userId: number, TargetId: number) {
        const user = await this.userRepository.findOneBy({
            id: userId,
        })
        const target = await this.userRepository.findOneBy({
            id: TargetId,
        })

        if (await this.isBlockedBy(userId, TargetId))
            throw new BadRequestException('You are blocked by this user')
        else if (await this.isBlockedBy(TargetId, userId))
            throw new BadRequestException('Unblock this User to start chating')
        else {
            let channelName = user.nickname + ' & ' + target.nickname
            let channel = await this.channelRepository.findOne({
                where: { name: channelName },
                relations: ['users'],
            })
            if (!channel) {
                channelName = target.nickname + ' & ' + user.nickname
                let channel = await this.channelRepository.findOne({
                    where: { name: channelName },
                    relations: ['users'],
                })
            }
            if (channel) {
                if (channel.users.some((u) => u.id === user.id)) {
                    return channel
                } else {
                    const joinChannel = await this.joinChannel(
                        channel.id,
                        userId,
                        ''
                    )
                    return joinChannel
                }
            } else {
                const createChannelDto = new CreateChannelDto()
                createChannelDto.owner = user
                createChannelDto.admin = [user]
                createChannelDto.users = [user, target]
                createChannelDto.type = 'direct'
                createChannelDto.name = user.nickname + ' & ' + target.nickname
                createChannelDto.password = ''
                const channelCreated =
                    this.channelRepository.create(createChannelDto)
                return await this.channelRepository.save(channelCreated)
            }
        }
    }

    async deleteChannel(channelId: number, userId: number) {
        const channel = await this.channelRepository.findOne({
            where: { id: channelId },
        })
        if (!channel) {
            throw new NotFoundException('Channel not found')
        }

        return await this.channelRepository.remove(channel)
    }

    async changePassword(channelId: number, PlainTextPassword: string) {
        try {
            const chan = await this.channelRepository.findOne({
                where: { id: channelId },
            })
            chan.password = await bcrypt.hash(PlainTextPassword, 10)
            await this.channelRepository.update(channelId, chan)
            return true
        } catch (error) {
            return false
        }
    }
}
