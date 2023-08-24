import { Channel } from 'src/typeorm/channel.entity';
export declare class CreateMessageDto {
    creator: number;
    content: string;
    channelId: number;
    creationDate: Date;
    channel: Channel;
    userNickname: string;
    userAvatarUrl: string;
}
