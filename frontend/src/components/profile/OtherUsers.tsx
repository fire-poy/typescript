import styles from './OtherUsers.module.css'
import IconAddFriend from '../../assets/icon/add_friend.svg'
import ClickableIcon from './ClickableIcon'
import { useState } from 'react'
import CustomLink from './CustomLink'

export interface OtherUserProps {
    id: number
    nickname: string
    avatarUrl: string
}

const OtherUser = ({ id, nickname, avatarUrl }: OtherUserProps) => {
    const profilePictureStyle = {
        backgroundImage: `url(${avatarUrl})`,
        backgroundSize: 'cover',
    }

    const [successfullyDone, setSuccessfullyDone] = useState(false)

    const sendFriendRequest = async (id: number) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/friend/create/${id}`,
                {
                    method: 'POST',
                    credentials: 'include',
                }
            )

            if (!response.ok) {
                throw new Error('Error sending friendhip request')
            }
            setSuccessfullyDone(true)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className={styles.container}>
            {!successfullyDone && (
                <>
                    <div>
                        <ClickableIcon
                            icon={IconAddFriend}
                            onClick={() => sendFriendRequest(id)}
                        ></ClickableIcon>
                    </div>
                    <div
                        className={styles.profilePicture}
                        style={profilePictureStyle}
                    ></div>
                    <div className={styles.nameAndStatus}>
                        <CustomLink to={`/user/${nickname}`}>
                            <h3>{nickname}</h3>
                        </CustomLink>
                    </div>
                </>
            )}
        </div>
    )
}

export default OtherUser
