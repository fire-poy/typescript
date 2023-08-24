import { User } from './user.entity';
export declare class Match {
    id: number;
    winner: User;
    loser: User;
    scoreWinner: number;
    scoreLoser: number;
    dateGame: Date;
}
