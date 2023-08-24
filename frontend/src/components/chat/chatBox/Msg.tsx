import styles from './Msg.module.css'
import { useAppSelector } from '../../../store/types'
import { UserData } from '../../../types/UserData'
import IconBlocked from '../../../assets/icon/block_user.svg'

export interface MsgProps {
    msg: {
        id: number
        creator: number
        content: string
        userNickname: string
        userAvatarUrl: string
    }
    blockedUsers: number[]
}

const Msg = ({ msg, blockedUsers }: MsgProps) => {
    const userData = useAppSelector((state) => state.user.userData) as UserData
    const myNickname = userData.user.nickname
    const isCreatorBlocked = blockedUsers.indexOf(msg.creator) !== -1

    return (
        <>
            {msg.userNickname === myNickname ? (
                <div className={`${styles.msgContainer} ${styles.me}`}>
                    <div className={styles.textContainer}>
                        <p className={styles.me}>
                            <b>{msg.userNickname} : </b> {msg.content}
                        </p>
                    </div>
                    <img
                        src={msg.userAvatarUrl}
                        alt="Avatar"
                        className={styles.profilePicture}
                    />
                </div>
            ) : isCreatorBlocked ? (
                <div className={`${styles.msgContainer} ${styles.they}`}>
                    <img
                        src={IconBlocked}
                        alt="Avatar"
                        className={styles.profilePicture}
                    />
                    <div className={styles.textContainer}>
                        <p className={styles.they}>
                            <b>{'BLOCKED'} : </b> {'blalblalblblalbal'}
                        </p>
                    </div>
                </div>
            ) : (
                <div className={`${styles.msgContainer} ${styles.they}`}>
                    <img
                        src={msg.userAvatarUrl}
                        alt="Avatar"
                        className={styles.profilePicture}
                    />
                    <div className={styles.textContainer}>
                        <p className={styles.they}>
                            <b>{msg.userNickname} : </b> {msg.content}
                        </p>
                    </div>
                </div>
            )}
        </>
    )
}

export default Msg
