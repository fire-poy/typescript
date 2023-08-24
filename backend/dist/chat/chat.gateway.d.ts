import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import { CreateMessageDto } from 'src/chat/dto/create-message.dto';
import { CreateChannelDto } from './dto/create-channel.dto';
import { Channel } from 'src/typeorm/channel.entity';
import { Repository } from 'typeorm';
type PasswordChangeData = [channelId: number, password: string];
type ChannelUserData = [channelId: number, userId: number];
type ChannelUserPassword = [channelId: number, userId: number, password: string];
type UserTargetData = [userId: number, targetId: number];
type UserTargetChannelData = [
    userId: number,
    targetId: number,
    channelId: number
];
export declare class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly chatService;
    private readonly channelRepository;
    constructor(chatService: ChatService, channelRepository: Repository<Channel>);
    private loger;
    server: Server;
    afterInit(server: Socket): void;
    handleConnection(client: Socket, ...args: any[]): void;
    handleDisconnect(client: Socket): void;
    postMsg(createMessageDto: CreateMessageDto): Promise<void>;
    findAllMsgByChannel(channelId: number): Promise<import("../typeorm/message.entity").Message[]>;
    findAllUsersByChannel(channelId: number): Promise<Channel>;
    blockUser(data: UserTargetData): Promise<void>;
    unblockUser(data: UserTargetData): Promise<void>;
    getBlockedUsers(myId: number): Promise<number[]>;
    setAdmin(data: UserTargetChannelData): Promise<void>;
    unsetAdmin(data: UserTargetChannelData): Promise<void>;
    kickUser(data: UserTargetChannelData): Promise<void>;
    banUser(data: UserTargetChannelData): Promise<void>;
    unbanUser(data: UserTargetChannelData): Promise<void>;
    getBannedUsers(channelId: number): Promise<number[]>;
    muteUser(data: UserTargetChannelData): Promise<void>;
    getMutedUsers(channelId: number): Promise<number[]>;
    createChannel(createChannelDto: CreateChannelDto): Promise<{
        channelId: number;
        error: string;
    } | {
        channelId: number;
        error?: undefined;
    }>;
    createDirectChannel(body: UserTargetData): Promise<Channel>;
    getAllChannels(): Promise<Channel[]>;
    joinChannel(data: ChannelUserPassword): Promise<Channel>;
    leaveChannel(data: ChannelUserData): Promise<Channel>;
    deleteChannel(data: ChannelUserData): Promise<Channel>;
    changeChannelPassword(data: PasswordChangeData): Promise<boolean>;
}
export {};
