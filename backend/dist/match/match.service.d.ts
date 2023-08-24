import { CreateMatchDto } from './dto/create-match.dto';
import { Repository } from 'typeorm';
import { Match } from '../typeorm/match.entity';
import { User } from '../typeorm/user.entity';
import { UserService } from 'src/user/user.service';
export declare class MatchService {
    private readonly matchRepository;
    private readonly userRepository;
    private userService;
    constructor(matchRepository: Repository<Match>, userRepository: Repository<User>, userService: UserService);
    create(createMatchDto: CreateMatchDto): Promise<Match>;
    findOne(id: number): Promise<Match>;
    findByUserId(userId: number): Promise<{
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
