/// <reference types="multer" />
import { User } from 'src/typeorm/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateNicknameDto } from './dto/update-nickname.dto';
import { FriendService } from 'src/friend/friend.service';
import { UserStatus } from 'src/typeorm/user.entity';
import { Friend } from 'src/typeorm/friend.entity';
import { Channel } from 'src/typeorm/channel.entity';
import { UpdatePlayersStatsDto } from './dto/update-player-stats.dto';
export declare class UserService {
    private readonly userRepository;
    private readonly friendService;
    private readonly friendRepository;
    private readonly channelRepository;
    constructor(userRepository: Repository<User>, friendService: FriendService, friendRepository: Repository<Friend>, channelRepository: Repository<Channel>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: number): Promise<User>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<{
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
        muted: import("../typeorm/channel-user-muted.entity").ChannelUserMuted[];
        friends: Friend[];
        friendOf: Friend[];
        matchLost: import("../typeorm/match.entity").Match[];
        matchWon: import("../typeorm/match.entity").Match[];
        createdFriends: Friend[];
        blockedUsers: User[];
        blockedBy: User[];
    } & User>;
    remove(id: number): Promise<User>;
    findByFT_id(FT_id: string): Promise<User>;
    findByNickname(nickname: string): Promise<User>;
    getUserRankingPosition(userId: number): Promise<number>;
    setTwoFactorAuthenticationSecret(secret: string, userID: number): Promise<User>;
    turnOnTwoFactorAuthentication(userID: number): Promise<User>;
    turnOffTwoFactorAuthentication(userID: number): Promise<User>;
    getLambdaInfo(nickname: string): Promise<{
        userPosition: number;
        id: number;
        nickname: string;
        avatarUrl: string;
        nbVictory: number;
        totalPlay: number;
        xp: number;
        TFAEnabled: boolean;
        status: UserStatus;
        ownedChannels: Channel[];
        joinedChannel: Channel[];
        admin: Channel[];
        banned: Channel[];
        muted: import("../typeorm/channel-user-muted.entity").ChannelUserMuted[];
        friends: Friend[];
        friendOf: Friend[];
        matchLost: import("../typeorm/match.entity").Match[];
        matchWon: import("../typeorm/match.entity").Match[];
        createdFriends: Friend[];
        blockedUsers: User[];
        blockedBy: User[];
    }>;
    updateNickname(req: any, updateNicknameDto: UpdateNicknameDto): Promise<void | {
        error: string;
        message?: undefined;
    } | {
        message: string;
        error?: undefined;
    }>;
    logStatus(req: any): {
        status: string;
        message?: undefined;
    } | {
        status: string;
        message: string;
    };
    uploadProfilePicture(req: any, file: Express.Multer.File): Promise<string>;
    getMyInfo(req: any): Promise<{
        userPosition: number;
        id: number;
        nickname: string;
        avatarUrl: string;
        nbVictory: number;
        totalPlay: number;
        xp: number;
        TFAEnabled: boolean;
        status: UserStatus;
        ownedChannels: Channel[];
        joinedChannel: Channel[];
        admin: Channel[];
        banned: Channel[];
        muted: import("../typeorm/channel-user-muted.entity").ChannelUserMuted[];
        friends: Friend[];
        friendOf: Friend[];
        matchLost: import("../typeorm/match.entity").Match[];
        matchWon: import("../typeorm/match.entity").Match[];
        createdFriends: Friend[];
        blockedUsers: User[];
        blockedBy: User[];
    }>;
    getFriendsAndRequests(req: any): Promise<{
        myId: number;
        listOfFriends: Friend[];
        listOfPendings: Friend[];
    }>;
    getAllUsersWithNoFriendship(req: any): Promise<{
        usersNotFriends: User[];
    }>;
    logout(req: any, res: any): Promise<void>;
    changeStatusOnLine(userId: number): Promise<void>;
    changeStatusPlaying(userId: number): Promise<void>;
    isBlockedByMe(req: any, target_id: number): Promise<boolean>;
    blockUser(monId: number, targetId: number): Promise<void>;
    unblockUser(myId: number, hisId: number): Promise<void>;
    updatePlayersStats(updatePlayersStatsDto: UpdatePlayersStatsDto): Promise<void>;
}
