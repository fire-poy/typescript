import {
    Controller,
    Post,
    Req,
    Body,
    Param,
    Request,
    HttpException,
    HttpStatus,
    Delete,
    UsePipes,
    ValidationPipe,
    NotFoundException,
} from '@nestjs/common'
import { RoomService } from './room.service'
import { Room } from 'src/types/Room'
import { ApiTags } from '@nestjs/swagger'
import { CreateRoomDto } from './dto/create-room.dto'

@ApiTags('room')
@Controller('room')
export class RoomController {
    constructor(private readonly roomService: RoomService) {}

    @Post()
    @UsePipes(ValidationPipe)
    async createRoom(
        @Request() req: any,
        @Body() createRoomDto: CreateRoomDto
    ): Promise<Room> {
        try {
            const room = await this.roomService.createRoom(req, createRoomDto)
            return room
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.CONFLICT)
        }
    }

    @Post('joinroom/random')
    async joinRoom(@Req() req: any): Promise<Room> {
        try {
            const room = await this.roomService.joinRandomRoom(req)
            return room
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.CONFLICT)
        }
    }

    @Delete('id/:roomId')
    deleteRoom(@Param('roomId') roomId: string) {
        try {
            return this.roomService.deleteRoom(roomId)
        } catch (error) {
            throw new NotFoundException()
        }
    }
}
