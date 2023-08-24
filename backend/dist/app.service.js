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
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./typeorm/user.entity");
const typeorm_2 = require("typeorm");
const channel_entity_1 = require("./typeorm/channel.entity");
const friend_entity_1 = require("./typeorm/friend.entity");
const message_entity_1 = require("./typeorm/message.entity");
const match_entity_1 = require("./typeorm/match.entity");
const user_service_1 = require("./user/user.service");
const user_entity_2 = require("./typeorm/user.entity");
const bcrypt = require("bcrypt");
let AppService = class AppService {
    constructor(userRepo, channelRepo, friendRepo, messageRepo, matchRepo, userService) {
        this.userRepo = userRepo;
        this.channelRepo = channelRepo;
        this.friendRepo = friendRepo;
        this.messageRepo = messageRepo;
        this.matchRepo = matchRepo;
        this.userService = userService;
    }
    async seed(id) {
        let j = 0;
        const user1 = this.userRepo.create({
            nickname: 'user1',
            xp: 12,
            avatarUrl: `${process.env.URL_BACKEND}/api/user/picture/user1.webp`,
            status: j % 3 === 0
                ? user_entity_2.UserStatus.Online
                : j % 3 === 1
                    ? user_entity_2.UserStatus.Offline
                    : user_entity_2.UserStatus.Playing,
        });
        j++;
        await this.userRepo.save(user1);
        const user2 = this.userRepo.create({
            nickname: 'user2',
            xp: 23,
            avatarUrl: `${process.env.URL_BACKEND}/api/user/picture/user2.webp`,
            status: j % 3 === 0
                ? user_entity_2.UserStatus.Online
                : j % 3 === 1
                    ? user_entity_2.UserStatus.Offline
                    : user_entity_2.UserStatus.Playing,
        });
        j++;
        await this.userRepo.save(user2);
        const user3 = this.userRepo.create({
            nickname: 'user3',
            xp: 34,
            avatarUrl: `${process.env.URL_BACKEND}/api/user/picture/user3.webp`,
            status: j % 3 === 0
                ? user_entity_2.UserStatus.Online
                : j % 3 === 1
                    ? user_entity_2.UserStatus.Offline
                    : user_entity_2.UserStatus.Playing,
        });
        j++;
        await this.userRepo.save(user3);
        const user4 = this.userRepo.create({
            nickname: 'user4',
            xp: 45,
            avatarUrl: `${process.env.URL_BACKEND}/api/user/picture/user4.webp`,
            status: j % 3 === 0
                ? user_entity_2.UserStatus.Online
                : j % 3 === 1
                    ? user_entity_2.UserStatus.Offline
                    : user_entity_2.UserStatus.Playing,
        });
        j++;
        await this.userRepo.save(user4);
        const user5 = this.userRepo.create({
            nickname: 'user5',
            xp: 56,
            avatarUrl: `${process.env.URL_BACKEND}/api/user/picture/user5.webp`,
            status: j % 3 === 0
                ? user_entity_2.UserStatus.Online
                : j % 3 === 1
                    ? user_entity_2.UserStatus.Offline
                    : user_entity_2.UserStatus.Playing,
        });
        j++;
        await this.userRepo.save(user5);
        const user6 = this.userRepo.create({
            nickname: 'user6',
            xp: 67,
            avatarUrl: `${process.env.URL_BACKEND}/api/user/picture/user6.webp`,
            status: j % 3 === 0
                ? user_entity_2.UserStatus.Online
                : j % 3 === 1
                    ? user_entity_2.UserStatus.Offline
                    : user_entity_2.UserStatus.Playing,
        });
        await this.userRepo.save(user6);
        j++;
        const user7 = this.userRepo.create({
            nickname: 'NOT MY FRIEND',
            xp: 54,
            avatarUrl: `${process.env.URL_BACKEND}/api/user/picture/user1.webp`,
            status: j % 3 === 0
                ? user_entity_2.UserStatus.Online
                : j % 3 === 1
                    ? user_entity_2.UserStatus.Offline
                    : user_entity_2.UserStatus.Playing,
        });
        await this.userRepo.save(user7);
        j++;
        const userMe = await this.userService.findOne(1);
        const chan1 = this.channelRepo.create({
            owner: user1,
            name: 'chan 1',
            type: 'public',
            password: null,
            admin: [user1],
            users: [user1, user2, user5],
        });
        await this.channelRepo.save(chan1);
        const chan2 = this.channelRepo.create({
            owner: user1,
            name: 'chan 2',
            type: 'public',
            password: null,
            admin: [user1],
            users: [user1, user4],
        });
        await this.channelRepo.save(chan2);
        let hashedPassword = await bcrypt.hash('1234', 10);
        const chan3 = this.channelRepo.create({
            owner: user1,
            name: 'chan 3',
            type: 'private',
            password: hashedPassword,
            admin: [user1],
            users: [user1, user3],
        });
        await this.channelRepo.save(chan3);
        const chan4 = this.channelRepo.create({
            owner: user2,
            name: 'chan 4',
            type: 'private',
            password: hashedPassword,
            admin: [user2],
            users: [user2, user4],
        });
        await this.channelRepo.save(chan4);
        const chan5 = this.channelRepo.create({
            owner: user2,
            name: 'chan 5',
            type: 'direct',
            password: '',
            admin: [user2],
            users: [user2, user5],
        });
        await this.channelRepo.save(chan5);
        const chan6 = this.channelRepo.create({
            owner: user3,
            name: 'chan 6',
            type: 'direct',
            password: '',
            admin: [user3],
        });
        chan6.users = [user3, user4];
        await this.channelRepo.save(chan6);
        const users = [userMe, user1, user2, user3, user4, user5, user6];
        const friendship1 = this.friendRepo.create({
            user: userMe,
            friend: user1,
            isPending: false,
            createdBy: userMe,
        });
        await this.friendRepo.save(friendship1);
        const friendship2 = this.friendRepo.create({
            user: userMe,
            friend: user3,
            isPending: true,
            createdBy: userMe,
        });
        await this.friendRepo.save(friendship2);
        const friendship3 = this.friendRepo.create({
            user: user4,
            friend: userMe,
            isPending: true,
            createdBy: user4,
        });
        await this.friendRepo.save(friendship3);
        const friendship4 = this.friendRepo.create({
            user: user5,
            friend: userMe,
            isPending: false,
            createdBy: user5,
        });
        await this.friendRepo.save(friendship4);
        const friendship5 = this.friendRepo.create({
            user: user2,
            friend: user4,
            isPending: false,
            createdBy: user2,
        });
        await this.friendRepo.save(friendship5);
        const friendship6 = this.friendRepo.create({
            user: userMe,
            friend: user6,
            isPending: false,
            createdBy: user6,
        });
        await this.friendRepo.save(friendship6);
        const allusers = await this.userRepo.find();
        for (let i = 0; i < 10; i++) {
            const userA = allusers[Math.floor(Math.random() * allusers.length)];
            const userB = allusers[Math.floor(Math.random() * allusers.length)];
            const isUserAWinner = Math.random() >= 0.5;
            const winner = isUserAWinner ? userA : userB;
            const loser = isUserAWinner ? userB : userA;
            this.userRepo.update(winner, {
                totalPlay: winner.totalPlay + 1,
                nbVictory: winner.nbVictory + 1,
                xp: winner.xp + 10,
            });
            this.userRepo.update(loser, {
                totalPlay: loser.totalPlay + 1,
                xp: loser.xp + 10,
            });
            const scoreWinner = Math.floor(Math.random() * 6);
            const scoreLoser = Math.floor(Math.random() * 6);
            const dateGame = new Date();
            const match = this.matchRepo.create({
                winner,
                loser: loser,
                scoreWinner,
                scoreLoser,
                dateGame,
            });
            await this.matchRepo.save(match);
        }
        const loggedUser = await this.userRepo.findOne({ where: { id } });
        const loggedMatch = this.matchRepo.create({
            winner: loggedUser,
            loser: user1,
            scoreWinner: 7,
            scoreLoser: 5,
            dateGame: new Date(),
        });
        this.userRepo.update(loggedUser, {
            totalPlay: loggedUser.totalPlay + 1,
            nbVictory: loggedUser.nbVictory + 1,
            xp: loggedUser.xp + 50,
        });
        this.userRepo.update(user1, {
            totalPlay: user1.totalPlay + 1,
            xp: user1.xp + 25,
        });
        await this.matchRepo.save(loggedMatch);
    }
};
AppService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(channel_entity_1.Channel)),
    __param(2, (0, typeorm_1.InjectRepository)(friend_entity_1.Friend)),
    __param(3, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __param(4, (0, typeorm_1.InjectRepository)(match_entity_1.Match)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        user_service_1.UserService])
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map