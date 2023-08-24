import styles from './UserLambdaInformation.module.css'
import { UserData } from '../../types/UserData'
import { useEffect, useRef, useState } from 'react'
import { useAppSelector } from '../../store/types'
import IconBlocked from '../../assets/icon/block_user.svg'

export interface UserLambdaInformationProps {
    userData: UserData
}

const UserLambdaInformation = ({ userData }: UserLambdaInformationProps) => {
    const id = userData.user.id

    const myData = useAppSelector((state) => state.user.userData) as UserData
    const myId = myData.user.id

    //Context menu Context menu Context menu Context menu Context menu Context menu
    const contextMenuRef = useRef<HTMLDivElement>(null)
    const [showContextMenu, setShowContextMenu] = useState(false)
    const [contextMenuPosition, setContextMenuPosition] = useState({
        x: 0,
        y: 0,
    })

    const handleContextMenu = (event: React.MouseEvent<HTMLImageElement>) => {
        event.preventDefault()
        setShowContextMenu(true)
        setContextMenuPosition({
            x: event.clientX,
            y: event.clientY + window.scrollY,
        })
    }

    const handleContextMenuClose = () => {
        setShowContextMenu(false)
    }

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (
                contextMenuRef.current &&
                !contextMenuRef.current.contains(event.target as Node)
            ) {
                handleContextMenuClose()
            }
        }

        if (showContextMenu) {
            document.addEventListener('click', handleOutsideClick)
        }

        return () => {
            document.removeEventListener('click', handleOutsideClick)
        }
    }, [showContextMenu])

    // Block user Block user Block user Block user Block user Block user
    const [isBlocked, setIsBlocked] = useState(false)

    const isBlockedByMe = async () => {
        const response = await fetch(
            `http://localhost:8080/api/user/isBlockedByMe/${id}`,
            {
                method: 'GET',
                credentials: 'include',
            }
        )
        const data = await response.json()
        if (data) {
            setIsBlocked(true)
        } else {
            setIsBlocked(false)
        }
    }

    useEffect(() => {
        isBlockedByMe()
    }, [])

    const blockUser = async () => {
        const response = await fetch(
            `http://localhost:8080/api/user/block/${id}`,
            {
                method: 'POST',
                credentials: 'include',
            }
        )
        const data = await response.json()
        if (data) {
            isBlockedByMe()
        }
    }

    const unblockUser = async () => {
        const response = await fetch(
            `http://localhost:8080/api/user/unblock/${id}`,
            {
                method: 'DELETE',
                credentials: 'include',
            }
        )
        const data = await response.json()
        if (data) {
            isBlockedByMe()
        }
    }

    const blockUserHandler = () => {
        blockUser()
    }

    const unblockUserHandler = () => {
        unblockUser()
    }

    let toggleBlockUser: JSX.Element | null = null
    if (id !== myId) {
        toggleBlockUser = isBlocked ? (
            <li onClick={unblockUserHandler}>Unblock</li>
        ) : (
            <li onClick={blockUserHandler}>Block</li>
        )
    }

    const profilePictureStyle = {
        backgroundImage: isBlocked
            ? `url(${IconBlocked})`
            : `url(${userData.user.avatarUrl})`,
        backgroundSize: 'cover',
    }

    const userLevel = Math.floor(userData.user.xp / 100 + 1)

    return (
        <div className={styles.container}>
            <div
                onContextMenu={id !== myId ? handleContextMenu : undefined}
                className={styles.profilePicture}
                style={profilePictureStyle}
            ></div>
            {showContextMenu && (
                <div
                    ref={contextMenuRef}
                    className={styles.contextMenu}
                    style={{
                        top: contextMenuPosition.y,
                        left: contextMenuPosition.x,
                    }}
                    onClick={handleContextMenuClose}
                >
                    {toggleBlockUser}
                </div>
            )}
            <div>
                <ul className={styles.verticalList}>
                    <li>{userData.user.nickname}</li>
                    <li>Level {userLevel}</li>
                </ul>
            </div>
        </div>
    )
}

export default UserLambdaInformation
