import { User } from '../../typeorm/user.entity';
export declare class CreateMatchDto {
    winner: User;
    loser: User;
    scoreWinner: number;
    scoreLoser: number;
}
