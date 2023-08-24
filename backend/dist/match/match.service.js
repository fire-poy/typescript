"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const match_entity_1 = require("../typeorm/match.entity");
const user_entity_1 = require("../typeorm/user.entity");
const user_service_1 = require("../user/user.service");
let MatchService = class MatchService {
    constructor(matchRepository, userRepository, userService) {
        this.matchRepository = matchRepository;
        this.userRepository = userRepository;
        this.userService = userService;
    }
    async create(createMatchDto) {
        try {
            const newMatch = this.matchRepository.create(createMatchDto);
            return this.matchRepository.save(newMatch);
        }
        catch (error) {
            console.error('Error while creating match', error);
        }
    }
    findOne(id) {
        return this.matchRepository.findOne({ where: { id } });
    }
    async findByUserId(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new Error('User not found');
        }
        const matchesDB = await this.matchRepository.find({
            where: [{ winner: user }, { loser: user }],
            relations: ['winner', 'loser'],
        });
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
        }));
        return matchesFront;
    }
};
MatchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(match_entity_1.Match)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        user_service_1.UserService])
], MatchService);
exports.MatchService = MatchService;
//# sourceMappingURL=match.service.js.map