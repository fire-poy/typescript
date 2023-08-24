import BoardGame from './../components/pong/BoardGame'
import styles from './Game.module.css'
import { useLocation } from 'react-router-dom'
import theme1 from '../assets/bg/theme1.webp'
import theme2 from '../assets/bg/theme2.avif'
import theme3 from '../assets/bg/theme3.avif'

const Game = () => {
    const location = useLocation()
    const roomId = location.state.roomId
    const player_one = location.state.player_one
    const player_two = location.state.player_two
    const theme = location.state.theme

    const themeImages: { [key: string]: string } = {
        'Theme 1': theme1,
        'Theme 2': theme2,
        'Theme 3': theme3,
    }

    const selectedThemeImage = themeImages[theme]

    return (
        <div
            style={{
                backgroundImage: `url(${selectedThemeImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '85vh',
                width: '100vw',
            }}
        >
            <div className={styles.container}>
                <div className={styles.verticalLine}></div>
                <BoardGame
                    room={roomId}
                    player_one={player_one}
                    player_two={player_two}
                    imPlayerOne={location.state.imPlayerOne}
                />
            </div>
        </div>
    )
}

export default Game
