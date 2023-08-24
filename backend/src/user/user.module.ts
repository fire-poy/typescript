import { Module, forwardRef } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/typeorm/user.entity'
import { FriendService } from 'src/friend/friend.service'
import { FriendModule } from 'src/friend/friend.module'
import { Friend } from 'src/typeorm/friend.entity'
import { Channel } from 'src/typeorm/channel.entity'

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Friend, Channel]),
        forwardRef(() => FriendModule),
    ],
    controllers: [UserController],
    providers: [UserService, FriendService],
    exports: [UserService, TypeOrmModule],
})
export class UserModule {}
