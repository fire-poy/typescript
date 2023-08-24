import { IsNotEmpty, IsOptional } from 'class-validator'
import { Channel } from 'src/typeorm/channel.entity'

export class CreateMessageDto {
    @IsNotEmpty()
    creator: number

    @IsNotEmpty()
    content: string

    @IsNotEmpty()
    channelId: number

    @IsOptional()
    creationDate: Date

    @IsOptional()
    channel: Channel

    @IsOptional()
    userNickname: string

    @IsOptional()
    userAvatarUrl: string
}
