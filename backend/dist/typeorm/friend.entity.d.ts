import { User } from './user.entity';
export declare class Friend {
    id: number;
    user: User;
    friend: User;
    isPending: boolean;
    createdBy: User;
}
