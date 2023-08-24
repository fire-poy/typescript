import { useNavigate } from 'react-router-dom'
import SocketGame from '../sockets/SocketGame'
import { useEffect, useState } from 'react'
import { UserData } from '../types/UserData'
import { useAppSelector } from '../store/types'
import { Button } from 'antd'
import styles from './InvitationHandler.module.css'

const InvitationHandler = () => {
    const [youHaveAnInvitation, setyouHaveAnInvitation] =
        useState<boolean>(false)
    const userData = useAppSelector((state) => state.user.userData) as UserData
    const [roomInvited, setRoomInvited] = useState<string>('')
    const [userInvitingNickname, setUserInvitingNickname] = useState<string>('')
    const [userInvitingId, setUserInvitingId] = useState<number>(0)
    const socket = SocketGame.getInstance().connect()
    const navigate = useNavigate()

    useEffect(() => {
        socket.on(
            'receiveInvitation',
            function (data: {
                player_one_nickname: string
                player_one_id: number
                player_two: number
                room: string
            }) {
                if (data.player_two === userData.user.id) {
                    setyouHaveAnInvitation(true)
                    setRoomInvited(data.room)
                    setUserInvitingNickname(data.player_one_nickname)
                    setUserInvitingId(data.player_one_id)
                }
            }
        )

        socket.on(
            'cancelInvitation',
            function (data: { player_two: number; room: string }) {
                if (
                    data.player_two === userData.user.id &&
                    data.room === roomInvited
                ) {
                    setyouHaveAnInvitation(false)
                    setRoomInvited('')
                    setUserInvitingNickname('')
                    setUserInvitingId(0)
                }
            }
        )

        return () => {
            socket.off('receiveInvitation')
            socket.off('cancelInvitation')
        }
    }, [roomInvited, userInvitingNickname])

    const acceptInvitation = () => {
        navigate('/game', {
            state: {
                player_one: userInvitingId,
                player_two: userData.user.id,
                theme: 'original',
                roomId: roomInvited,
                imPlayerOne: false,
            },
        })
    }

    const declineInvitation = () => {
        socket.emit('declineInvitation', {
            player_one: userInvitingId,
            player_two: userData.user.nickname,
            room: roomInvited,
        })
        setyouHaveAnInvitation(false)
    }

    return (
        <div>
            {youHaveAnInvitation && (
                <div className={styles.overlay}>
                    <h4>you have received an invitation</h4>
                    <h4>to play from {userInvitingNickname}</h4>
                    <div className={styles.buttonContainer}>
                        <Button
                            className={styles.btn}
                            type="primary"
                            onClick={acceptInvitation}
                        >
                            Accept
                        </Button>
                        <Button
                            className={styles.btn}
                            type="primary"
                            onClick={declineInvitation}
                        >
                            Decline
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
export default InvitationHandler
