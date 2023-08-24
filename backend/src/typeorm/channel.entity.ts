import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    ManyToMany,
    OneToMany,
    ManyToOne,
    JoinColumn,
} from 'typeorm'
import { User } from './user.entity'
import { Message } from './message.entity'
import { ChannelUserMuted } from './channel-user-muted.entity'

@Entity()
export class Channel {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, (user) => user.ownedChannels)
    @JoinColumn({ name: 'ownedChannels' })
    owner: User

    @Column({ type: 'varchar', length: 500 })
    name: string

    @Column()
    type: string

    @Column({
        nullable: true,
    })
    password: string

    @CreateDateColumn()
    creationDate: Date

    @ManyToMany(() => User, (user) => user.joinedChannel)
    users: User[]

    @ManyToMany(() => User, (user) => user.admin)
    admin: User[]

    @ManyToMany(() => User, (user) => user.banned)
    banned: User[]

    // @ManyToMany(() => User, (user) => user.muted)
    // muted: Map<User, Date>

    @OneToMany(
        () => ChannelUserMuted,
        (channelUserMuted) => channelUserMuted.channel
    )
    muted: ChannelUserMuted[]

    @OneToMany(() => Message, (message) => message.channelId)
    @JoinColumn({ name: 'messages' })
    messages: Message[]
}
