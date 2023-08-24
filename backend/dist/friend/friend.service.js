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
exports.FriendService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const friend_entity_1 = require("../typeorm/friend.entity");
const user_entity_1 = require("../typeorm/user.entity");
let FriendService = class FriendService {
    constructor(friendRepository, userRepository) {
        this.friendRepository = friendRepository;
        this.userRepository = userRepository;
    }
    async create(req, id) {
        const userMe = await this.userRepository.findOneBy({ id: req.user.id });
        if (!userMe) {
            throw new common_1.NotFoundException('User not found');
        }
        const userFriend = await this.userRepository.findOneBy({ id: id });
        if (!userFriend) {
            throw new common_1.NotFoundException('User not found');
        }
        const friendship = new friend_entity_1.Friend();
        friendship.isPending = true;
        friendship.user = userMe;
        friendship.friend = userFriend;
        friendship.createdBy = userMe;
        return this.friendRepository.save(friendship);
    }
    findOne(friendId) {
        return this.friendRepository
            .createQueryBuilder('friend')
            .leftJoinAndSelect('friend.user', 'user')
            .where('friend.id = :id', { id: friendId })
            .getOne();
    }
    async accept(id, updateFriendDto) {
        const friendship = await this.findOne(id);
        if (!friendship) {
            throw new common_1.NotFoundException('Friendship not found');
        }
        return this.friendRepository.save(Object.assign(Object.assign({}, friendship), updateFriendDto));
    }
    async remove(id) {
        const friendship = await this.findOne(id);
        if (!friendship) {
            throw new common_1.NotFoundException('Friendship not found');
        }
        return this.friendRepository.remove(friendship);
    }
    async getFiendsAndRequests(userId) {
        const meAsCreator = await this.friendRepository
            .createQueryBuilder('friend')
            .leftJoin('friend.friend', 'user')
            .leftJoin('friend.createdBy', 'createdBy')
            .where('friend.userId = :userId', { userId })
            .addSelect([
            'user.id',
            'user.nickname',
            'user.avatarUrl',
            'user.status',
            'createdBy.id',
        ])
            .getMany();
        const otherAsCreator = await this.friendRepository
            .createQueryBuilder('friend')
            .leftJoin('friend.user', 'user')
            .leftJoin('friend.createdBy', 'createdBy')
            .where('friend.friendId = :userId', { userId })
            .addSelect([
            'user.id',
            'user.nickname',
            'user.avatarUrl',
            'user.status',
            'createdBy.id',
        ])
            .getMany();
        const allFriends = meAsCreator.concat(otherAsCreator);
        const listOfPendings = allFriends.filter((friend) => friend.isPending);
        const listOfFriends = allFriends.filter((friend) => !friend.isPending);
        const myId = userId;
        return { myId, listOfFriends, listOfPendings };
    }
};
__decorate([
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], FriendService.prototype, "create", null);
FriendService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(friend_entity_1.Friend)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], FriendService);
exports.FriendService = FriendService;
//# sourceMappingURL=friend.service.js.map