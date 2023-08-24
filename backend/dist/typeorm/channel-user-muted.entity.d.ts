import { Channel } from './channel.entity';
import { User } from './user.entity';
export declare class ChannelUserMuted {
    id: number;
    channel: Channel;
    user: User;
    mutedAt: Date;
}
