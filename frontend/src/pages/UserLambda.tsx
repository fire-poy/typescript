import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import styles from './UserLambda.module.css'
import StatisticsLambda from '../components/profile/StatisticsLambda'
import UserLambdaInformation from '../components/UserLambda/UserLambdaInformation'
import { UserData } from '../types/UserData'
import { MatchList } from '../components/history/MatchList'
import InvitationHandler from '../sockets/InvitationHandler'

const UserLambda = () => {
    const [loading, setLoading] = useState(true)
    const [userData, setUserData] = useState<UserData>({} as UserData)
    const { nickname } = useParams<{ nickname: string }>()

    useEffect(() => {
        getCurrentUser()
    }, [])

    async function getCurrentUser() {
        try {
            const response = await fetch(
                `http://localhost:8080/api/user/nickname/${nickname}`,
                {
                    method: 'GET',
                    credentials: 'include',
                }
            )
            if (!response.ok) {
                throw new Error('Failed to fetch user')
            }
            const data = await response.json()
            setUserData({ user: data })
            setLoading(false)
        } catch (error) {
            console.log('Error:', error)
            window.location.href = '/profile'
        }
    }

    if (loading) {
        return <div>Loading...</div>
    }
    return (
        <div>
            <InvitationHandler />
            <div className={styles.container}>
                <div className={styles.body}>
                    <div className={styles.bodyLeftSide}>
                        <UserLambdaInformation userData={userData} />
                        <StatisticsLambda userData={userData} />
                    </div>
                    <div className={styles.bodyRightSide}>
                        <MatchList
                            userData={userData}
                            isInUserLambda={true}
                        ></MatchList>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserLambda
