import { useEffect, useState } from 'react'
import { MatchData } from '../../types/MatchData'
import styles from './MatchList.module.css'
import { UserData } from '../../types/UserData'

export interface UserProp {
    userData: UserData
    isInUserLambda: boolean
}

const MatchList = ({ userData, isInUserLambda }: UserProp) => {
    const [matchHistory, setMatchHistory] = useState<MatchData[]>([])

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const res = await fetch(
                    `http://localhost:8080/api/match/user/${String(
                        userData.user.id
                    )}`,
                    { credentials: 'include' }
                )
                const resjson = await res.json()
                setMatchHistory(resjson)
            } catch (error) {
                console.log(error)
            }
        }
        fetchMatches()
    }, [])

    const matchHistoryWinner = matchHistory.map((match: MatchData) => (
        <div className={styles.left} key={match.id}>
            <div>
                <div>{match.winnerNick}</div>
                <div>level {match.winnerLevel}</div>
            </div>
            <img src={match.winnerPfp} alt="winner avatar" />
            <div className={styles.score}>{match.scoreWinner}</div>
        </div>
    ))

    const matchHistoryLoser = matchHistory.map((match: MatchData) => (
        <div className={styles.right} key={match.id}>
            <div className={styles.score}>{match.scoreLoser}</div>
            <img src={match.loserPfp} alt="loser avatar" />
            <div>
                <div>{match.loserNick}</div>
                <div>level {match.loserLevel}</div>
            </div>
        </div>
    ))

    return (
        <div
            className={`${styles.container} ${
                isInUserLambda ? styles.transparent : ''
            }`}
        >
            <h1>Match History</h1>
            <div className={styles.match_list}>
                <div>
                    <h3>Winner</h3>
                    {matchHistoryWinner}
                </div>
                <div>
                    <h3>Loser</h3>
                    {matchHistoryLoser}
                </div>
            </div>
        </div>
    )
}

export { MatchList }
