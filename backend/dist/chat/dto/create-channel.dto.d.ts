import { User } from 'src/typeorm/user.entity';
import { Message } from '../../typeorm/message.entity';
export declare class CreateChannelDto {
    owner: User;
    ownerId: number;
    name: string;
    type: string;
    password: string;
    admin: User[];
    users: User[];
    messages: Message[];
}
