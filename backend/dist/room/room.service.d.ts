import { Room } from 'src/types/Room';
import { User } from 'src/typeorm/user.entity';
import { Repository } from 'typeorm';
import { CreateRoomDto } from './dto/create-room.dto';
import { UserService } from 'src/user/user.service';
export declare class RoomService {
    private readonly userRepository;
    private readonly userService;
    constructor(userRepository: Repository<User>, userService: UserService);
    private rooms;
    getAllRooms(): Room[];
    getRoomById(id: number): Room;
    createRoom(req: any, createRoomDto: CreateRoomDto): Promise<Room>;
    updateRoom(id: number, updatedRoom: Room): Room;
    printRooms(rooms: Room[]): void;
    deleteRoom(room_id: string): Room | null;
    sleep(ms: number): Promise<void>;
    joinRandomRoom(req: any): Promise<Room>;
}
