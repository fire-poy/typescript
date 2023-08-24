import { FriendService } from './friend.service';
import { UpdateFriendDto } from './dto/update-friend.dto';
export declare class FriendController {
    private readonly friendService;
    constructor(friendService: FriendService);
    create(req: any, id: string): Promise<{
        'Friendship request successfully submitted': string;
    }>;
    accept(id: string, updateFriendDto: UpdateFriendDto): Promise<{
        'Friendship successfully accepted': string;
    }>;
    remove(id: string): Promise<{
        'Friendship successfully removed': string;
    }>;
}
