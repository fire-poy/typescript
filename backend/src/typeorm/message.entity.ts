import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm'
import { Channel } from './channel.entity'

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'int' })
    creator: number

    @Column({ type: 'text' })
    userNickname: string

    @Column({ type: 'text' })
    userAvatarUrl: string

    @Column({ type: 'text' })
    content: string

    @ManyToOne(() => Channel, (channel) => channel.messages, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'channelId' })
    channelId: number

    @CreateDateColumn()
    creationDate: Date
}
