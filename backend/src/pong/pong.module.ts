import { Module } from '@nestjs/common'
import { PongGateway } from './pong.gateway'
import { PongService } from './pong.service'
import { Server } from 'socket.io'
import { UserModule } from 'src/user/user.module'
@Module({
    imports: [UserModule],
    providers: [PongGateway, PongService, Server],
})
export class PongModule {}
