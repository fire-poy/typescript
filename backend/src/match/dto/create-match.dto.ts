import { IsNotEmpty, IsOptional } from 'class-validator'
import { User } from '../../typeorm/user.entity'

export class CreateMatchDto {
    @IsNotEmpty()
    winner: User

    @IsNotEmpty()
    loser: User

    @IsNotEmpty()
    scoreWinner: number

    @IsNotEmpty()
    scoreLoser: number
}
