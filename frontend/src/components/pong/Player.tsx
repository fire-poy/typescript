import styles from './Player.module.css'
import { UserData } from '../../types/UserData'

interface PlayerProps {
    userData: UserData
}

const Player = ({ userData }: PlayerProps) => {
    if (!userData || !userData.user) {
        return <div>Loading...</div>
    }

    const profilePictureStyle = {
        backgroundImage: `url(${userData.user.avatarUrl})`,
        backgroundSize: 'cover',
    }

    return (
        <div className={styles.container}>
            <div
                className={styles.profilePicture}
                style={profilePictureStyle}
            ></div>
            <li>{userData.user.nickname}</li>
        </div>
    )
}

export default Player
