import { Module } from '@nestjs/common'
import { RoomController } from './room.controller'
import { RoomService } from './room.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from 'src/user/user.module'
import { User } from 'src/typeorm/user.entity'
import { forwardRef } from '@nestjs/common'
@Module({
    imports: [TypeOrmModule.forFeature([User]), forwardRef(() => UserModule)],
    controllers: [RoomController],
    providers: [RoomService],
})
export class RoomModule {}
