/// <reference types="multer" />
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateNicknameDto } from './dto/update-nickname.dto';
import { Response } from 'express';
import { UpdatePlayersStatsDto } from './dto/update-player-stats.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(createUserDto: CreateUserDto): Promise<import("../typeorm/user.entity").User>;
    findOne(id: string): Promise<import("../typeorm/user.entity").User>;
    getMyInfo(req: any): Promise<{
        userPosition: number;
        id: number;
        nickname: string;
        avatarUrl: string;
        nbVictory: number;
        totalPlay: number;
        xp: number;
        TFAEnabled: boolean;
        status: import("../typeorm/user.entity").UserStatus;
        ownedChannels: import("../typeorm/channel.entity").Channel[];
        joinedChannel: import("../typeorm/channel.entity").Channel[];
        admin: import("../typeorm/channel.entity").Channel[];
        banned: import("../typeorm/channel.entity").Channel[];
        muted: import("../typeorm/channel-user-muted.entity").ChannelUserMuted[];
        friends: import("../typeorm/friend.entity").Friend[];
        friendOf: import("../typeorm/friend.entity").Friend[];
        matchLost: import("../typeorm/match.entity").Match[];
        matchWon: import("../typeorm/match.entity").Match[];
        createdFriends: import("../typeorm/friend.entity").Friend[];
        blockedUsers: import("../typeorm/user.entity").User[];
        blockedBy: import("../typeorm/user.entity").User[];
    }>;
    getFriendsAndRequests(req: any): Promise<{
        myId: number;
        listOfFriends: import("../typeorm/friend.entity").Friend[];
        listOfPendings: import("../typeorm/friend.entity").Friend[];
    }>;
    getOtherUsers(req: any): Promise<{
        usersNotFriends: import("../typeorm/user.entity").User[];
    }>;
    getLambda(nickname: string): Promise<{
        userPosition: number;
        id: number;
        nickname: string;
        avatarUrl: string;
        nbVictory: number;
        totalPlay: number;
        xp: number;
        TFAEnabled: boolean;
        status: import("../typeorm/user.entity").UserStatus;
        ownedChannels: import("../typeorm/channel.entity").Channel[];
        joinedChannel: import("../typeorm/channel.entity").Channel[];
        admin: import("../typeorm/channel.entity").Channel[];
        banned: import("../typeorm/channel.entity").Channel[];
        muted: import("../typeorm/channel-user-muted.entity").ChannelUserMuted[];
        friends: import("../typeorm/friend.entity").Friend[];
        friendOf: import("../typeorm/friend.entity").Friend[];
        matchLost: import("../typeorm/match.entity").Match[];
        matchWon: import("../typeorm/match.entity").Match[];
        createdFriends: import("../typeorm/friend.entity").Friend[];
        blockedUsers: import("../typeorm/user.entity").User[];
        blockedBy: import("../typeorm/user.entity").User[];
    }>;
    updateNickname(req: any, updateNicknameDto: UpdateNicknameDto): Promise<void | {
        error: string;
        message?: undefined;
    } | {
        message: string;
        error?: undefined;
    }>;
    logout(req: any, res: any): Promise<void>;
    uploadProfilePicture(req: any, file: Express.Multer.File): Promise<{
        message: string;
        photoUrl: string;
    }>;
    getPhoto(filename: any, res: any): Promise<void>;
    serveProfileImage(filename: string, res: Response): Promise<void>;
    isBlockedByMe(target_id: string, req: any): Promise<boolean>;
    blockUser(target_id: string, req: any): Promise<{
        message: string;
    }>;
    unblockUser(target_id: string, req: any): Promise<{
        message: string;
    }>;
    updatePlayersStats(updatePlayersStatsDto: UpdatePlayersStatsDto): Promise<{
        message: string;
    }>;
}
