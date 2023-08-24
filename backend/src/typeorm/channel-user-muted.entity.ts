import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
} from 'typeorm'
import { JoinColumn } from 'typeorm'
import { Channel } from './channel.entity'
import { User } from './user.entity'

@Entity()
export class ChannelUserMuted {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Channel, (channel) => channel.muted, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'channelId' })
    channel: Channel

    @ManyToOne(() => User, (user) => user.muted, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'userId' })
    user: User

    @CreateDateColumn()
    mutedAt: Date
}
