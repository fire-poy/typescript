import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToMany,
    JoinTable,
    OneToMany,
} from 'typeorm'
import { Channel } from './channel.entity'
import { Friend } from './friend.entity'
import { Match } from './match.entity'
import { ChannelUserMuted } from './channel-user-muted.entity'

export enum UserStatus {
    Online = 'online',
    Offline = 'offline',
    Playing = 'playing',
}
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        unique: true,
        type: 'text',
    })
    nickname: string

    @Column('text')
    avatarUrl: string

    @Column({ type: 'int', default: 0 })
    nbVictory: number

    @Column({ type: 'int', default: 0 })
    totalPlay: number

    @Column({ type: 'int', default: 0 })
    xp: number

    @Column({ default: '' })
    TFASecret: string

    @Column({ default: false })
    TFAEnabled: boolean

    @Column({ default: '' })
    FT_id: string

    @Column({
        type: 'enum',
        enum: UserStatus,
        default: UserStatus.Online,
    })
    status: UserStatus

    @OneToMany(() => Channel, (channel) => channel.owner)
    ownedChannels: Channel[]

    @ManyToMany(() => Channel, (channel) => channel.users)
    @JoinTable()
    joinedChannel: Channel[]

    @ManyToMany(() => Channel, (channel) => channel.admin)
    @JoinTable()
    admin: Channel[]

    @ManyToMany(() => Channel, (channel) => channel.banned)
    @JoinTable()
    banned: Channel[]

    @OneToMany(
        () => ChannelUserMuted,
        (channelUserMuted) => channelUserMuted.user
    )
    muted: ChannelUserMuted[]
    // @ManyToMany(() => Channel, (channel) => channel.muted)
    // @JoinTable()
    // muted: Map<Channel, Date>

    @OneToMany(() => Friend, (friend) => friend.user)
    friends: Friend[]

    @OneToMany(() => Friend, (friend) => friend.friend)
    friendOf: Friend[]

    @OneToMany(() => Match, (match) => match.loser)
    matchLost: Match[]

    @OneToMany(() => Match, (match) => match.winner)
    matchWon: Match[]

    @OneToMany(() => Friend, (friend) => friend.createdBy)
    createdFriends: Friend[]

    @ManyToMany(() => User, (user) => user.blockedBy)
    @JoinTable()
    blockedUsers: User[]

    @ManyToMany(() => User, (user) => user.blockedUsers)
    blockedBy: User[]
}
