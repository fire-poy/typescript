import { IsNotEmpty, IsOptional } from 'class-validator'
import { User } from 'src/typeorm/user.entity'
import { Channel } from '../../typeorm/channel.entity'

export class CreateChannelUserMutedDto {
    @IsNotEmpty()
    user: User

    @IsNotEmpty()
    channel: Channel

    @IsOptional()
    mutedAt: Date
}
