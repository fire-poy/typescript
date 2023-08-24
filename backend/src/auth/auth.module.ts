import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { AuthController } from './auth.controller'
import { Auth42Strategy } from './strategies/auth42.strategy'
import { SessionSerializer } from './session.serializer'
import { AuthService } from './auth.service'
import { UserModule } from 'src/user/user.module'
import { UserService } from 'src/user/user.service'
import { FriendModule } from 'src/friend/friend.module'
@Module({
    imports: [
        PassportModule.register({ session: true }),
        UserModule,
        FriendModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, Auth42Strategy, SessionSerializer, UserService],
})
export class AuthModule {}
