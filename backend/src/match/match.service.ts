import { Injectable } from '@nestjs/common'
import { CreateMatchDto } from './dto/create-match.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Match } from '../typeorm/match.entity'
import { User } from '../typeorm/user.entity'
import { UserService } from 'src/user/user.service'

@Injectable()
export class MatchService {
    constructor(
        @InjectRepository(Match)
        private readonly matchRepository: Repository<Match>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private userService: UserService
    ) {}

    async create(createMatchDto: CreateMatchDto) {
        try {
            const newMatch = this.matchRepository.create(createMatchDto)
            return this.matchRepository.save(newMatch)
        } catch (error) {
            console.error('Error while creating match', error)
        }
    }

    findOne(id: number) {
        return this.matchRepository.findOne({ where: { id } })
    }

    async findByUserId(userId: number) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        })
        if (!user) {
            throw new Error('User not found')
        }
        const matchesDB = await this.matchRepository.find({
            where: [{ winner: user }, { loser: user }],
            relations: ['winner', 'loser'],
        })

        const matchesFront = matchesDB.map((m) => ({
            id: m.id,
            winnerNick: m.winner.nickname,
            winnerLevel: Math.floor(m.winner.xp / 100 + 1),
            winnerPfp: m.winner.avatarUrl,
            loserNick: m.loser.nickname,
            loserLevel: Math.floor(m.loser.xp / 100 + 1),
            loserPfp: m.loser.avatarUrl,
            scoreWinner: m.scoreWinner,
            scoreLoser: m.scoreLoser,
        }))
        return matchesFront
    }
}
