import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm'
import { User } from './user.entity'

@Entity()
export class Match {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, (user) => user.matchWon)
    @JoinColumn({ name: 'winner' })
    winner: User

    @ManyToOne(() => User, (user) => user.matchLost)
    @JoinColumn({ name: 'loser' })
    loser: User

    @Column({ type: 'int' })
    scoreWinner: number

    @Column({ type: 'int' })
    scoreLoser: number

    @CreateDateColumn()
    dateGame: Date
}
