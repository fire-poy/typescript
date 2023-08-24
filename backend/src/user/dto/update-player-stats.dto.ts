import { IsNotEmpty } from 'class-validator'

export class UpdatePlayersStatsDto {
    @IsNotEmpty()
    winner: number

    @IsNotEmpty()
    loser: number
}
