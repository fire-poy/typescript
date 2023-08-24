export interface UserData {
    user: {
        id: number
        nickname: string
        avatarUrl: string
        nbVictory: number
        totalPlay: number
        xp: number
        TFAEnabled: boolean
        userPosition: number
    }
}

export interface User {
    id: number
    nickname: string
    avatarUrl: string
    nbVictory: number
    totalPlay: number
    xp: number
    TFAEnabled: boolean
    status: string
    TFASecret: string
    FT_id: string
}
