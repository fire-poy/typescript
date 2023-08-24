import styles from './Friend.module.css'
import IconRemoveFriend from '../../assets/icon/remove_friend.svg'
import ClickableIcon from './ClickableIcon'
import IconAcceptFriend from '../../assets/icon/accept_friend.svg'
import { useState } from 'react'
import CustomLink from './CustomLink'

export interface FriendProps {
    id: number
    nickname: string
    avatarUrl: string
    status: 'online' | 'offline' | 'playing'
    isPending: boolean
    createdByMe: boolean
}

const Friend = ({
    id,
    nickname,
    avatarUrl,
    status,
    isPending,
    createdByMe,
}: FriendProps) => {
    const getBorderColor = () => {
        switch (status) {
            case 'online':
                return 'var(--color-purple)'
            case 'playing':
                return 'var(--color-mid-green)'
            case 'offline':
                return 'var(--color-black-grey)'
        }
    }

    const getOpacity = () => {
        switch (status) {
            case 'online':
                return '100%'
            case 'playing':
                return '100%'
            case 'offline':
                return '70%'
        }
    }

    const profilePictureStyle = {
        backgroundImage: `url(${avatarUrl})`,
        backgroundSize: 'cover',
        borderColor: getBorderColor(),
        opacity: getOpacity(),
    }

    let statusColorClass = ''

    if (status === 'online') {
        statusColorClass = styles.online
    } else if (status === 'playing') {
        statusColorClass = styles.playing
    }

    const [successfullyDone, setSuccessfullyDone] = useState(false)

    const removeFriendship = async (id: number) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/friend/delete/${id}`,
                {
                    method: 'DELETE',
                    credentials: 'include',
                }
            )

            if (!response.ok) {
                throw new Error('Error deleting friendhip')
            }
            setSuccessfullyDone(true)
        } catch (error) {
            console.error(error)
        }
    }

    const acceptFriendship = async (id: number) => {
        try {
            const updateFriendDto = {
                isPending: false,
            }

            const response = await fetch(
                `http://localhost:8080/api/friend/accept/${id}`,
                {
                    method: 'PATCH',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updateFriendDto),
                }
            )

            if (!response.ok) {
                throw new Error('Error accepting friendhip')
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
                        {isPending && !createdByMe && (
                            <ClickableIcon
                                icon={IconRemoveFriend}
                                onClick={() => removeFriendship(id)}
                            ></ClickableIcon>
                        )}

                        <ClickableIcon
                            icon={
                                isPending
                                    ? createdByMe
                                        ? IconRemoveFriend
                                        : IconAcceptFriend
                                    : IconRemoveFriend
                            }
                            onClick={
                                isPending
                                    ? createdByMe
                                        ? () => removeFriendship(id)
                                        : () => acceptFriendship(id)
                                    : () => removeFriendship(id)
                            }
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
                        <p className={`${styles.status} ${statusColorClass}`}>
                            {status}
                        </p>
                    </div>
                </>
            )}
        </div>
    )
}

export default Friend
