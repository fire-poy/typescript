import { Channel } from './channel.entity';
import { Friend } from './friend.entity';
import { Match } from './match.entity';
import { ChannelUserMuted } from './channel-user-muted.entity';
export declare enum UserStatus {
    Online = "online",
    Offline = "offline",
    Playing = "playing"
}
export declare class User {
    id: number;
    nickname: string;
    avatarUrl: string;
    nbVictory: number;
    totalPlay: number;
    xp: number;
    TFASecret: string;
    TFAEnabled: boolean;
    FT_id: string;
    status: UserStatus;
    ownedChannels: Channel[];
    joinedChannel: Channel[];
    admin: Channel[];
    banned: Channel[];
    muted: ChannelUserMuted[];
    friends: Friend[];
    friendOf: Friend[];
    matchLost: Match[];
    matchWon: Match[];
    createdFriends: Friend[];
    blockedUsers: User[];
    blockedBy: User[];
}
