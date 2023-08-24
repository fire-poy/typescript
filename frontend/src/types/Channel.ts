import { User } from './UserData'

export interface Channel {
    id: number
    name: string
    type: string
    password?: string
    creationDate?: Date
    users: User[]
    owner: User
}
