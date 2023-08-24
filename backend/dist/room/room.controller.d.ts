import { RoomService } from './room.service';
import { Room } from 'src/types/Room';
import { CreateRoomDto } from './dto/create-room.dto';
export declare class RoomController {
    private readonly roomService;
    constructor(roomService: RoomService);
    createRoom(req: any, createRoomDto: CreateRoomDto): Promise<Room>;
    joinRoom(req: any): Promise<Room>;
    deleteRoom(roomId: string): Room;
}
