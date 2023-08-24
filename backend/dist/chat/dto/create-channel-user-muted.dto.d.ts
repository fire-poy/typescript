import { User } from 'src/typeorm/user.entity';
import { Channel } from '../../typeorm/channel.entity';
export declare class CreateChannelUserMutedDto {
    user: User;
    channel: Channel;
    mutedAt: Date;
}
