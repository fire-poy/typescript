import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './typeorm/user.entity'
import { Repository } from 'typeorm'
import { Channel } from './typeorm/channel.entity'
import { Friend } from './typeorm/friend.entity'
import { Message } from './typeorm/message.entity'
import { Match } from './typeorm/match.entity'
import { UserService } from './user/user.service'
import { UserStatus } from './typeorm/user.entity'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AppService {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        @InjectRepository(Channel) private channelRepo: Repository<Channel>,
        @InjectRepository(Friend) private friendRepo: Repository<Friend>,
        @InjectRepository(Message) private messageRepo: Repository<Message>,
        @InjectRepository(Match) private matchRepo: Repository<Match>,
        private readonly userService: UserService
    ) {}

    async seed(id: number) {
        //  create Users
        let j: number = 0

        const user1 = this.userRepo.create({
            nickname: 'user1',
            xp: 12,
            avatarUrl: `${process.env.URL_BACKEND}/api/user/picture/user1.webp`,
            status:
                j % 3 === 0
                    ? UserStatus.Online
                    : j % 3 === 1
                    ? UserStatus.Offline
                    : UserStatus.Playing,
        })
        j++
        await this.userRepo.save(user1)
        const user2 = this.userRepo.create({
            nickname: 'user2',
            xp: 23,
            avatarUrl: `${process.env.URL_BACKEND}/api/user/picture/user2.webp`,
            status:
                j % 3 === 0
                    ? UserStatus.Online
                    : j % 3 === 1
                    ? UserStatus.Offline
                    : UserStatus.Playing,
        })
        j++
        await this.userRepo.save(user2)
        const user3 = this.userRepo.create({
            nickname: 'user3',
            xp: 34,
            avatarUrl: `${process.env.URL_BACKEND}/api/user/picture/user3.webp`,
            status:
                j % 3 === 0
                    ? UserStatus.Online
                    : j % 3 === 1
                    ? UserStatus.Offline
                    : UserStatus.Playing,
        })
        j++
        await this.userRepo.save(user3)
        const user4 = this.userRepo.create({
            nickname: 'user4',
            xp: 45,
            avatarUrl: `${process.env.URL_BACKEND}/api/user/picture/user4.webp`,
            status:
                j % 3 === 0
                    ? UserStatus.Online
                    : j % 3 === 1
                    ? UserStatus.Offline
                    : UserStatus.Playing,
        })
        j++
        await this.userRepo.save(user4)
        const user5 = this.userRepo.create({
            nickname: 'user5',
            xp: 56,
            avatarUrl: `${process.env.URL_BACKEND}/api/user/picture/user5.webp`,
            status:
                j % 3 === 0
                    ? UserStatus.Online
                    : j % 3 === 1
                    ? UserStatus.Offline
                    : UserStatus.Playing,
        })
        j++
        await this.userRepo.save(user5)
        const user6 = this.userRepo.create({
            nickname: 'user6',
            xp: 67,
            avatarUrl: `${process.env.URL_BACKEND}/api/user/picture/user6.webp`,
            status:
                j % 3 === 0
                    ? UserStatus.Online
                    : j % 3 === 1
                    ? UserStatus.Offline
                    : UserStatus.Playing,
        })
        await this.userRepo.save(user6)
        j++
        const user7 = this.userRepo.create({
            nickname: 'NOT MY FRIEND',
            xp: 54,
            avatarUrl: `${process.env.URL_BACKEND}/api/user/picture/user1.webp`,
            status:
                j % 3 === 0
                    ? UserStatus.Online
                    : j % 3 === 1
                    ? UserStatus.Offline
                    : UserStatus.Playing,
        })
        await this.userRepo.save(user7)
        j++

        const userMe = await this.userService.findOne(1)

        //   create Channels
        const chan1 = this.channelRepo.create({
            owner: user1,
            name: 'chan 1',
            type: 'public',
            password: null,
            admin: [user1],
            users: [user1, user2, user5],
        })
        await this.channelRepo.save(chan1)

        const chan2 = this.channelRepo.create({
            owner: user1,
            name: 'chan 2',
            type: 'public',
            password: null,
            admin: [user1],
            users: [user1, user4],
        })
        await this.channelRepo.save(chan2)

        let hashedPassword = await bcrypt.hash('1234', 10)
        const chan3 = this.channelRepo.create({
            owner: user1,
            name: 'chan 3',
            type: 'private',
            password: hashedPassword,
            admin: [user1],
            users: [user1, user3],
        })
        await this.channelRepo.save(chan3)

        const chan4 = this.channelRepo.create({
            owner: user2,
            name: 'chan 4',
            type: 'private',
            password: hashedPassword,
            admin: [user2],
            users: [user2, user4],
        })
        await this.channelRepo.save(chan4)

        const chan5 = this.channelRepo.create({
            owner: user2,
            name: 'chan 5',
            type: 'direct',
            password: '',
            admin: [user2],
            users: [user2, user5],
        })
        await this.channelRepo.save(chan5)

        const chan6 = this.channelRepo.create({
            owner: user3,
            name: 'chan 6',
            type: 'direct',
            password: '',
            admin: [user3],
        })
        chan6.users = [user3, user4]
        await this.channelRepo.save(chan6)

        // Create friendships
        const users = [userMe, user1, user2, user3, user4, user5, user6]

        // for (const user of users) {
        //     const friends = users.filter((p) => p.id !== user.id).slice(0, 3)
        //     let j: number = 0

        //     for (const friend of friends) {
        //         const friendship = this.friendRepo.create({
        //             user: user,
        //             friend: friend,
        //             isPending: j % 2 === 0 ? true : false,
        //         })
        //         j++
        //         await this.friendRepo.save(friendship)
        //     }
        // }

        const friendship1 = this.friendRepo.create({
            user: userMe,
            friend: user1,
            isPending: false,
            createdBy: userMe,
        })
        await this.friendRepo.save(friendship1)

        const friendship2 = this.friendRepo.create({
            user: userMe,
            friend: user3,
            isPending: true,
            createdBy: userMe,
        })
        await this.friendRepo.save(friendship2)

        const friendship3 = this.friendRepo.create({
            user: user4,
            friend: userMe,
            isPending: true,
            createdBy: user4,
        })
        await this.friendRepo.save(friendship3)

        const friendship4 = this.friendRepo.create({
            user: user5,
            friend: userMe,
            isPending: false,
            createdBy: user5,
        })
        await this.friendRepo.save(friendship4)

        const friendship5 = this.friendRepo.create({
            user: user2,
            friend: user4,
            isPending: false,
            createdBy: user2,
        })
        await this.friendRepo.save(friendship5)

        const friendship6 = this.friendRepo.create({
            user: userMe,
            friend: user6,
            isPending: false,
            createdBy: user6,
        })
        await this.friendRepo.save(friendship6)

        // Create messages
        // const channels = await this.channelRepo.find()
        // for (const channel of channels) {
        //     let userCount = 3
        //     if (channel.type === 'direct') {
        //         userCount = 2
        //     }

        //     const users = await this.userRepo.find({ take: userCount })
        //     const channelUsers = users
        //         .filter((user) => user !== channel.owner)
        //         .filter((user) => user !== undefined)
        //     if (channelUsers.length >= userCount) {
        //         channelUsers.pop()
        //     }

        //     const allUsers = await this.userRepo.find()
        //     const owner = allUsers.find((user) => user === channel.owner)
        //     channelUsers.unshift(owner)

        //     for (let i = 0; i < 10; i++) {
        //         const creator = channelUsers[i % userCount].id
        //         const content = `Message ${i + 1}`

        //         const message = this.messageRepo.create({
        //             creator,
        //             content,
        //             creationDate: new Date(),
        //             channelId: channel,
        //         })

        //         await this.messageRepo.save(message)
        //     }
        // }

        const allusers = await this.userRepo.find()

        for (let i = 0; i < 10; i++) {
            const userA = allusers[Math.floor(Math.random() * allusers.length)]
            const userB = allusers[Math.floor(Math.random() * allusers.length)]
            const isUserAWinner = Math.random() >= 0.5 // 50% chance for userA to win

            const winner = isUserAWinner ? userA : userB
            const loser = isUserAWinner ? userB : userA
            this.userRepo.update(winner, {
                totalPlay: winner.totalPlay + 1,
                nbVictory: winner.nbVictory + 1,
                xp: winner.xp + 10,
            })
            this.userRepo.update(loser, {
                totalPlay: loser.totalPlay + 1,
                xp: loser.xp + 10,
            })
            const scoreWinner = Math.floor(Math.random() * 6)
            const scoreLoser = Math.floor(Math.random() * 6)
            const dateGame = new Date()

            const match = this.matchRepo.create({
                winner,
                loser: loser,
                scoreWinner,
                scoreLoser,
                dateGame,
            })

            await this.matchRepo.save(match)
        }

        const loggedUser = await this.userRepo.findOne({ where: { id } })

        const loggedMatch = this.matchRepo.create({
            winner: loggedUser,
            loser: user1,
            scoreWinner: 7,
            scoreLoser: 5,
            dateGame: new Date(),
        })

        this.userRepo.update(loggedUser, {
            totalPlay: loggedUser.totalPlay + 1,
            nbVictory: loggedUser.nbVictory + 1,
            xp: loggedUser.xp + 50,
        })
        this.userRepo.update(user1, {
            totalPlay: user1.totalPlay + 1,
            xp: user1.xp + 25,
        })

        await this.matchRepo.save(loggedMatch)
    }
}
