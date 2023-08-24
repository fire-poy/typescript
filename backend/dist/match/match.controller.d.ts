import { MatchService } from './match.service';
import { CreateMatchDto } from './dto/create-match.dto';
export declare class MatchController {
    private readonly matchService;
    constructor(matchService: MatchService);
    create(createMatchDto: CreateMatchDto): Promise<import("../typeorm/match.entity").Match>;
    findByUserId(id: string): Promise<{
        id: number;
        winnerNick: string;
        winnerLevel: number;
        winnerPfp: string;
        loserNick: string;
        loserLevel: number;
        loserPfp: string;
        scoreWinner: number;
        scoreLoser: number;
    }[]>;
}
