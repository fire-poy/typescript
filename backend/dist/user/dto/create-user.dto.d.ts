import { UserStatus } from 'src/typeorm/user.entity';
export declare class CreateUserDto {
    nickname: string;
    avatarUrl: string;
    nbVictory?: number;
    totalPlay?: number;
    xp?: number;
    TFASecret?: string;
    TFAEnabled?: boolean;
    FT_id?: string;
    status: UserStatus;
}
