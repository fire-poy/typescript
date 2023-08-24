import { Module } from '@nestjs/common'
import { ChatService } from './chat.service'
import { ChatGateway } from './chat.gateway'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Message } from 'src/typeorm/message.entity'
import { Channel } from 'src/typeorm/channel.entity'
import { User } from 'src/typeorm/user.entity'
import { ChannelUserMuted } from 'src/typeorm/channel-user-muted.entity'

@Module({
    providers: [ChatGateway, ChatService],
    imports: [
        TypeOrmModule.forFeature([Message, Channel, User, ChannelUserMuted]),
    ],
})
export class ChatModule {}
