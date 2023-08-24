import { Injectable, NotFoundException, Request, Param } from '@nestjs/common'
import { UpdateFriendDto } from './dto/update-friend.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, createQueryBuilder } from 'typeorm'
import { Friend } from 'src/typeorm/friend.entity'
import { User } from 'src/typeorm/user.entity'

@Injectable()
export class FriendService {
    constructor(
        @InjectRepository(Friend)
        private readonly friendRepository: Repository<Friend>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async create(@Request() req: any, @Param('id') id: number) {
        const userMe = await this.userRepository.findOneBy({ id: req.user.id })
        if (!userMe) {
            throw new NotFoundException('User not found')
        }
        const userFriend = await this.userRepository.findOneBy({ id: id })
        if (!userFriend) {
            throw new NotFoundException('User not found')
        }

        const friendship = new Friend()
        friendship.isPending = true
        friendship.user = userMe
        friendship.friend = userFriend
        friendship.createdBy = userMe

        return this.friendRepository.save(friendship)
    }

    findOne(friendId: number) {
        return this.friendRepository
            .createQueryBuilder('friend')
            .leftJoinAndSelect('friend.user', 'user')
            .where('friend.id = :id', { id: friendId })
            .getOne()
    }

    async accept(id: number, updateFriendDto: UpdateFriendDto) {
        const friendship = await this.findOne(id)
        if (!friendship) {
            throw new NotFoundException('Friendship not found')
        }

        return this.friendRepository.save({ ...friendship, ...updateFriendDto })
    }

    async remove(id: number) {
        const friendship = await this.findOne(id)
        if (!friendship) {
            throw new NotFoundException('Friendship not found')
        }

        return this.friendRepository.remove(friendship)
    }

    async getFiendsAndRequests(userId: number) {
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
            .getMany()

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
            .getMany()

        const allFriends = meAsCreator.concat(otherAsCreator)

        const listOfPendings = allFriends.filter((friend) => friend.isPending)
        const listOfFriends = allFriends.filter((friend) => !friend.isPending)
        const myId = userId

        return { myId, listOfFriends, listOfPendings }
    }
}
