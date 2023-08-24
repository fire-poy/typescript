import { User } from './typeorm/user.entity';
import { Repository } from 'typeorm';
import { Channel } from './typeorm/channel.entity';
import { Friend } from './typeorm/friend.entity';
import { Message } from './typeorm/message.entity';
import { Match } from './typeorm/match.entity';
import { UserService } from './user/user.service';
export declare class AppService {
    private userRepo;
    private channelRepo;
    private friendRepo;
    private messageRepo;
    private matchRepo;
    private readonly userService;
    constructor(userRepo: Repository<User>, channelRepo: Repository<Channel>, friendRepo: Repository<Friend>, messageRepo: Repository<Message>, matchRepo: Repository<Match>, userService: UserService);
    seed(id: number): Promise<void>;
}
