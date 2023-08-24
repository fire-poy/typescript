import {
    Injectable,
    NotFoundException,
    Request,
    Param,
    UnauthorizedException,
    Req,
    Res,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/typeorm/user.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { Repository, Not, In } from 'typeorm'
import { UpdateUserDto } from './dto/update-user.dto'
import { UpdateNicknameDto } from './dto/update-nickname.dto'
import { v4 as uuidv4 } from 'uuid'
import { extname, basename } from 'path'
import * as fs from 'fs'
import { FriendService } from 'src/friend/friend.service'
import { UserStatus } from 'src/typeorm/user.entity'
import { Friend } from 'src/typeorm/friend.entity'
import { Channel } from 'src/typeorm/channel.entity'
import { UpdatePlayersStatsDto } from './dto/update-player-stats.dto'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly friendService: FriendService,
        @InjectRepository(Friend)
        private readonly friendRepository: Repository<Friend>,
        @InjectRepository(Channel)
        private readonly channelRepository: Repository<Channel>
    ) {}

    create(createUserDto: CreateUserDto) {
        try {
            const user = this.userRepository.create(createUserDto)
            return this.userRepository.save(user)
        } catch (error) {
            console.log(error)
        }
    }

    findAll() {
        try {
            return this.userRepository.find()
        } catch (error) {
            console.log(error)
        }
    }

    findOne(id: number) {
        const user = this.userRepository.findOneBy({ id: id })
        if (!user) {
            throw new NotFoundException('User not found')
        }
        return user
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        try {
            const user = await this.findOne(id)
            return this.userRepository.save({ ...user, ...updateUserDto })
        } catch (error) {
            console.log(error)
        }
    }

    async remove(id: number) {
        try {
            const user = await this.findOne(id)
            return this.userRepository.remove(user)
        } catch (error) {
            console.log(error)
        }
    }

    findByFT_id(FT_id: string) {
        try {
            return this.userRepository.findOneBy({ FT_id: FT_id })
        } catch (error) {
            console.log(error)
        }
    }

    async findByNickname(nickname: string) {
        try {
            const user = await this.userRepository.findOneBy({
                nickname: nickname,
            })

            return user
        } catch (error) {
            console.error('Error when searching for the user: ', error)
        }
    }

    async getUserRankingPosition(userId: number): Promise<number> {
        try {
            const user = await this.findOne(userId)
            if (!user) {
                console.log('User not found')
            }

            const userPosition = await this.userRepository
                .createQueryBuilder('user')
                .where('user.xp >= :userXp', { userXp: user.xp })
                .getCount()
            return userPosition
        } catch (error) {
            console.log(error)
        }
    }

    async setTwoFactorAuthenticationSecret(secret: string, userID: number) {
        try {
            const user = await this.userRepository.findOne({
                where: { id: userID },
            })

            if (user) {
                user.TFASecret = secret
                return this.userRepository.save(user)
            }
            console.log(`User with id ${userID} not found`)
        } catch (error) {
            console.log(error)
        }
    }

    async turnOnTwoFactorAuthentication(userID: number) {
        try {
            const user = await this.userRepository.findOne({
                where: { id: userID },
            })

            if (user) {
                user.TFAEnabled = true
                return this.userRepository.save(user)
            }
            console.log(`User with id ${userID} not found`)
        } catch (error) {
            console.log(error)
        }
    }

    async turnOffTwoFactorAuthentication(userID: number) {
        try {
            const user = await this.userRepository.findOne({
                where: { id: userID },
            })

            if (user) {
                user.TFAEnabled = false
                return this.userRepository.save(user)
            }
            console.log(`User with id ${userID} not found`)
        } catch (error) {
            console.log(error)
        }
    }

    async getLambdaInfo(@Param('nickname') nickname: string) {
        try {
            const user = await this.findByNickname(nickname)

            if (!user) {
                throw new NotFoundException('User not found')
            }

            const { TFASecret, FT_id, ...rest } = user
            const userPosition = await this.getUserRankingPosition(user.id)

            return { ...rest, userPosition }
        } catch (error) {
            console.log(error)
        }
    }

    async updateNickname(
        @Request() req: any,
        updateNicknameDto: UpdateNicknameDto
    ) {
        try {
            const user = await this.findOne(req.user.id)
            if (!user) {
                throw new NotFoundException('User not found')
            }

            const { nickname } = updateNicknameDto

            if ((await this.findByNickname(nickname)) != null)
                return { error: 'Nickname already exists' }

            const updateUserDto: UpdateUserDto = {
                id: user.id,
                nickname: nickname,
            }

            this.update(user.id, updateUserDto)

            return { message: 'Nickname updated successfully' }
        } catch (error) {
            return console.log('Failed to update nickname')
        }
    }

    logStatus(@Req() req) {
        if (req.user && req.session.needTFA === false) {
            return { status: 'isLogged' }
        } else if (req.user && req.session.needTFA === true) {
            return { status: 'need2fa' }
        } else {
            return { status: 'error', message: 'Not authenticated' }
        }
    }

    async uploadProfilePicture(
        @Request() req: any,
        file: Express.Multer.File
    ): Promise<string> {
        if (!file) {
            console.log('No image was provided')
        }
        const destinationPath = '/app/profile-images'
        const uniqueSuffix = uuidv4()
        const fileExt = extname(file.originalname)
        const fileNameWithoutExtAndSpaces = basename(
            file.originalname,
            fileExt
        ).replace(/\s+/g, '_')
        const uniqueFilename = `${fileNameWithoutExtAndSpaces}${uniqueSuffix}${fileExt}`

        try {
            const fileData = fs.readFileSync(file.path)
            fs.writeFileSync(`${destinationPath}/${uniqueFilename}`, fileData)
            fs.unlinkSync(file.path)

            const serverBaseUrl = `${process.env.URL_BACKEND}/api/user`
            const photoUrl: string = `${serverBaseUrl}/profile-images/${uniqueFilename}`
            const user = await this.findOne(req.user.id)
            if (!user) {
                throw new NotFoundException('User not found')
            }

            const updateUserDto: UpdateUserDto = {
                id: user.id,
                avatarUrl: photoUrl,
            }

            await this.update(user.id, updateUserDto)

            return photoUrl
        } catch (error) {
            console.error('Error when moving profile image:', error)
        }
    }

    async getMyInfo(@Request() req: any) {
        const user = await this.findOne(req.user.id)
        if (!user) {
            throw new NotFoundException('User not found')
        }
        const { TFASecret, FT_id, ...rest } = user
        const userPosition = await this.getUserRankingPosition(req.user.id)
        return { ...rest, userPosition }
    }

    async getFriendsAndRequests(@Request() req: any) {
        const user = await this.findOne(req.user.id)
        if (!user) {
            throw new NotFoundException('User not found')
        }
        return this.friendService.getFiendsAndRequests(user.id)
    }

    async getAllUsersWithNoFriendship(@Request() req: any) {
        const user = await this.findOne(req.user.id)
        if (!user) {
            throw new NotFoundException('User not found')
        }

        const userId: number = user.id
        const friendsAddedByMe = await this.friendRepository
            .createQueryBuilder('friend')
            .select('friend.friendId', 'friendId')
            .where('friend.userId = :userId', { userId })
            .getRawMany()

        const friendsWhoAddedMe = await this.friendRepository
            .createQueryBuilder('follower')
            .select('follower.userId', 'userId')
            .where('follower.friendId = :userId', { userId })
            .getRawMany()

        const friendsByMeIds = friendsAddedByMe.map((friend) => friend.friendId)

        const friendsByOthersIds = friendsWhoAddedMe.map(
            (follower) => follower.userId
        )

        const usersNotFriends = await this.userRepository.find({
            where: {
                id: Not(In([...friendsByMeIds, ...friendsByOthersIds, userId])),
            },
            select: ['id', 'nickname', 'avatarUrl'],
        })

        if (!usersNotFriends) {
            throw new NotFoundException('Users not found')
        }
        return { usersNotFriends }
    }

    async logout(@Request() req: any, @Res() res: any) {
        try {
            const user = await this.findOne(req.user.id)

            if (!user) {
                throw new NotFoundException('User not found')
            }
            this.update(user.id, { id: user.id, status: UserStatus.Offline })

            await req.session.destroy()
            res.clearCookie('sessionID')
            res.status(200).json({ message: 'Logout successful' })
        } catch (error) {
            console.log(error)
        }
    }

    async changeStatusOnLine(userId: number) {
        try {
            const user = await this.findOne(userId)

            if (user && user.status != UserStatus.Online)
                this.update(userId, { id: userId, status: UserStatus.Online })
        } catch (error) {
            console.log(error)
        }
    }

    async changeStatusPlaying(userId: number) {
        try {
            const user = await this.findOne(userId)

            if (user && user.status != UserStatus.Playing)
                this.update(userId, { id: userId, status: UserStatus.Playing })
        } catch (error) {
            console.log(error)
        }
    }

    async isBlockedByMe(@Request() req: any, target_id: number) {
        try {
            const user = await this.userRepository.findOne({
                where: { id: req.user.id },
                relations: {
                    blockedUsers: true,
                },
            })
            if (user.blockedUsers.some((u) => u.id === target_id)) return true
            else return false
        } catch (error) {
            console.log(error)
        }
    }

    async blockUser(monId: number, targetId: number) {
        try {
            const user = await this.userRepository.findOne({
                where: { id: monId },
                relations: {
                    blockedUsers: true,
                },
            })
            if (!user) throw new NotFoundException('User not found')
            const userToBlock = await this.userRepository.findOne({
                where: { id: targetId },
                relations: {
                    blockedBy: true,
                },
            })
            if (!userToBlock) throw new NotFoundException('User not found')
            userToBlock.blockedBy.push(user)
            await this.userRepository.save(userToBlock)

            user.blockedUsers.push(userToBlock)
            await this.userRepository.save(user)

            let channelName = user.nickname + ' & ' + userToBlock.nickname
            let DM = await this.channelRepository.findOne({
                where: { name: channelName },
            })
            if (!DM) {
                channelName = userToBlock.nickname + ' & ' + user.nickname
                let DM = await this.channelRepository.findOne({
                    where: { name: channelName },
                })
                if (!DM) {
                    channelName = userToBlock.nickname + ' & ' + user.nickname
                    let DM = await this.channelRepository.findOne({
                        where: { name: channelName },
                    })
                }

                if (DM) {
                    await this.channelRepository.remove(DM)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    async unblockUser(myId: number, hisId: number) {
        try {
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
        } catch (error) {
            console.log(error)
        }
    }

    async updatePlayersStats(updatePlayersStatsDto: UpdatePlayersStatsDto) {
        let winner = await this.findOne(updatePlayersStatsDto.winner)
        winner.nbVictory += 1
        winner.totalPlay += 1
        winner.xp += 50
        this.update(winner.id, winner)

        let loser = await this.findOne(updatePlayersStatsDto.loser)
        loser.totalPlay += 1
        loser.xp += 25
        this.update(loser.id, loser)
    }
}
