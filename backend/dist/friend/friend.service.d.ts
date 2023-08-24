import { UpdateFriendDto } from './dto/update-friend.dto';
import { Repository } from 'typeorm';
import { Friend } from 'src/typeorm/friend.entity';
import { User } from 'src/typeorm/user.entity';
export declare class FriendService {
    private readonly friendRepository;
    private readonly userRepository;
    constructor(friendRepository: Repository<Friend>, userRepository: Repository<User>);
    create(req: any, id: number): Promise<Friend>;
    findOne(friendId: number): Promise<Friend>;
    accept(id: number, updateFriendDto: UpdateFriendDto): Promise<{
        friendId?: number;
        isPending: boolean;
        id: number;
        user: User;
        friend: User;
        createdBy: User;
    } & Friend>;
    remove(id: number): Promise<Friend>;
    getFiendsAndRequests(userId: number): Promise<{
        myId: number;
        listOfFriends: Friend[];
        listOfPendings: Friend[];
    }>;
}
