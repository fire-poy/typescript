import { IsNotEmpty, IsOptional } from 'class-validator'
import { UserStatus } from 'src/typeorm/user.entity'
export class CreateUserDto {
    @IsNotEmpty()
    nickname: string

    @IsNotEmpty()
    avatarUrl: string

    @IsOptional()
    nbVictory?: number

    @IsOptional()
    totalPlay?: number

    @IsOptional()
    xp?: number

    @IsOptional()
    TFASecret?: string

    @IsOptional()
    TFAEnabled?: boolean

    @IsOptional()
    FT_id?: string

    @IsOptional()
    status: UserStatus
}
