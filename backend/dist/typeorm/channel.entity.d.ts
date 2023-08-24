import { User } from './user.entity';
import { Message } from './message.entity';
import { ChannelUserMuted } from './channel-user-muted.entity';
export declare class Channel {
    id: number;
    owner: User;
    name: string;
    type: string;
    password: string;
    creationDate: Date;
    users: User[];
    admin: User[];
    banned: User[];
    muted: ChannelUserMuted[];
    messages: Message[];
}
