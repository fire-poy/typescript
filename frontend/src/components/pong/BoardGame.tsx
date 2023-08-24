import styles from './BoardGame.module.css'
import { useState, useEffect, useRef } from 'react'
import { useAppSelector } from '../../store/types'
import { UserData } from '../../types/UserData'
import { useNavigate } from 'react-router-dom'
import Player from './Player'
import SocketGameService from '../../sockets/SocketGame'

interface Position {
    x: number
    y: number
}
interface Size {
    width: number
    height: number
}

interface Rectangle {
    size: Size
    position: Position
}

interface Frame {
    paddleLeft: Rectangle
    paddleRight: Rectangle
    ball: Rectangle
    score: { playerOne: number; playerTwo: number }
    gameOver: boolean
}

function drawRectangle(
    ctx: CanvasRenderingContext2D,
    rectangle: Rectangle
): void {
    ctx.fillStyle = 'white'
    ctx.fillRect(
        rectangle.position.x,
        rectangle.position.y,
        rectangle.size.width,
        rectangle.size.height
    )
}

export interface BoardGameProps {
    room: string
    player_one: number
    player_two: number
    imPlayerOne: boolean
}

async function deleteRoomFromMatchingSystem(room: string) {
    try {
        const response = await fetch(
            `http://localhost:8080/api/room/id/${room}`,
            {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )

        if (!response.ok) {
            throw new Error('Error deleting room from matching system')
        }
    } catch (error) {
        console.error(error)
    }
}

const BoardGame = ({
    room,
    player_one,
    player_two,
    imPlayerOne,
}: BoardGameProps) => {
    const userData = useAppSelector((state) => state.user.userData) as UserData
    const [waitingForPlayer, setWaitingForPlayer] = useState<boolean>(false)
    let playerNumber: string =
        imPlayerOne === true ? 'player_one' : 'player_two'
    const BALL_SIZE: number = 2
    const PADDLE_WIDTH: number = 2
    const PADDLE_HEIGHT: number = 30
    const [winner, setWinner] = useState<string>('')
    const navigate = useNavigate()
    const [playerOneData, setPlayerOneData] = useState<UserData>({} as UserData)
    const [playerTwoData, setPlayerTwoData] = useState<UserData>({} as UserData)
    const matchSaved = useRef<boolean>(false)
    const gameOver = useRef<boolean>(false)
    const otherPlayerHasLeftTheRoom = useRef<boolean>(false)
    const [youHaveBeenRejected, setYouHaveBeenRejected] =
        useState<boolean>(false)
    const [playerTwoNameWhenDeclined, setPlayerTwoNameWhenDeclined] =
        useState<string>('')

    const [frame, setFrame] = useState<Frame>({
        paddleLeft: {
            size: { width: PADDLE_WIDTH, height: PADDLE_HEIGHT },
            position: { x: 10, y: 60 },
        },
        paddleRight: {
            size: { width: PADDLE_WIDTH, height: PADDLE_HEIGHT },
            position: { x: 280, y: 60 },
        },
        ball: {
            size: { width: BALL_SIZE, height: BALL_SIZE },
            position: { x: 50, y: 50 },
        },
        score: { playerOne: 0, playerTwo: 0 },
        gameOver: false,
    })

    async function getUserData(userId: number) {
        const response = await fetch(
            `http://localhost:8080/api/user/id/${userId}`,
            {
                method: 'GET',
                credentials: 'include',
            }
        )
        if (!response.ok) {
            throw new Error('Failed to fetch user')
        }
        return response.json()
    }

    // Draw the board
    useEffect(() => {
        let canvas: HTMLCanvasElement | null = document.getElementById(
            'boardGame'
        ) as HTMLCanvasElement
        if (canvas === null) {
            console.log('fail get canvas element')
            // TODO manage error
        }
        let ctx: CanvasRenderingContext2D | null = canvas.getContext('2d')
        if (ctx === null) {
            throw 'fail get context'
            // TODO manage error
        }

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        drawRectangle(ctx, frame.paddleLeft)
        drawRectangle(ctx, frame.paddleRight)
        drawRectangle(ctx, frame.ball)
    }, [frame])

    // Handle socket connections
    useEffect(() => {
        const socket = SocketGameService.getInstance().connect()

        if (playerNumber === 'player_one') {
            if (socket.connected) {
                socket.emit('createRoom', room)
            } else {
                socket.on('connect', () => {
                    socket.emit('createRoom', room)
                })
            }
        } else {
            if (socket.connected) {
                socket.emit('joinRoom', room, userData.user.id)
            } else {
                socket.on('connect', () => {
                    socket.emit('joinRoom', room, userData.user.id)
                })
            }
        }

        if (player_two !== 0) {
            socket.emit('sendInvitation', {
                player_one_nickname: userData.user.nickname,
                player_one_id: userData.user.id,
                player_two: player_two,
                room: room,
            })
        }

        socket.on(
            'declineInvitation',
            function (data: {
                player_one: number
                player_two: string
                room: string
            }) {
                if (
                    data.player_one === userData.user.id &&
                    data.room === room
                ) {
                    setPlayerTwoNameWhenDeclined(data.player_two)
                    setYouHaveBeenRejected(true)
                    setTimeout(() => {
                        navigate('/chat')
                    }, 3000)
                }
            }
        )

        socket.on('secondPlayerJoined', async (playerId) => {
            const dataPlayerOne = await getUserData(player_one)
            setPlayerOneData({ user: dataPlayerOne })

            const dataPlayerTwo = await getUserData(playerId)
            setPlayerTwoData({ user: dataPlayerTwo })
        })

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                socket.emit('movePaddle', {
                    player: playerNumber,
                    direction: event.key,
                    roomId: room,
                })
            }
        }

        socket.on('sendFrames', onReceiveFrames)

        function onReceiveFrames(updatedFrame: Frame) {
            setWaitingForPlayer(false)
            setFrame(updatedFrame)
            document.getElementById('scorePlayerOne')!.innerText =
                updatedFrame.score.playerOne.toString()
            document.getElementById('scorePlayerTwo')!.innerText =
                updatedFrame.score.playerTwo.toString()

            // Handle game over
            if (updatedFrame.gameOver && gameOver.current === false) {
                let winner: string =
                    updatedFrame.score.playerOne > updatedFrame.score.playerTwo
                        ? 'Player One'
                        : 'Player Two'
                setWinner(winner)
                gameOver.current = true
                socket.emit('resetGame', {
                    userId: userData.user.id,
                })

                // Save match
                if (imPlayerOne === false && !matchSaved.current) {
                    async function saveMatch() {
                        try {
                            const createMatchDto = {
                                winner:
                                    updatedFrame.score.playerOne >
                                    updatedFrame.score.playerTwo
                                        ? player_one
                                        : player_two,
                                loser:
                                    updatedFrame.score.playerOne >
                                    updatedFrame.score.playerTwo
                                        ? player_two
                                        : player_one,
                                scoreWinner:
                                    updatedFrame.score.playerOne >
                                    updatedFrame.score.playerTwo
                                        ? updatedFrame.score.playerOne
                                        : updatedFrame.score.playerTwo,
                                scoreLoser:
                                    updatedFrame.score.playerOne >
                                    updatedFrame.score.playerTwo
                                        ? updatedFrame.score.playerTwo
                                        : updatedFrame.score.playerOne,
                            }
                            const response = await fetch(
                                `http://localhost:8080/api/match`,
                                {
                                    method: 'POST',
                                    credentials: 'include',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(createMatchDto),
                                }
                            )

                            if (!response.ok) {
                                throw new Error(
                                    'Error saving match into the database'
                                )
                            }
                        } catch (error) {
                            console.error(error)
                        }
                    }
                    saveMatch()
                    matchSaved.current = true
                }

                if (imPlayerOne === false) {
                    console.log('updating players stats...')
                    async function updatePlayersStats() {
                        try {
                            const updatePlayersStatsDto = {
                                winner:
                                    updatedFrame.score.playerOne >
                                    updatedFrame.score.playerTwo
                                        ? player_one
                                        : player_two,
                                loser:
                                    updatedFrame.score.playerOne >
                                    updatedFrame.score.playerTwo
                                        ? player_two
                                        : player_one,
                            }
                            const response = await fetch(
                                `http://localhost:8080/api/user/updatePlayersStats`,
                                {
                                    method: 'POST',
                                    credentials: 'include',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(updatePlayersStatsDto),
                                }
                            )

                            if (!response.ok) {
                                throw new Error(
                                    'Error updating players stats into the database'
                                )
                            }
                        } catch (error) {
                            console.error(error)
                        }
                    }
                    updatePlayersStats()
                    matchSaved.current = true
                }

                setTimeout(() => {
                    navigate('/play')
                }, 3000)
            }
        }

        document.addEventListener('keydown', handleKeyDown)

        socket.on('waitingForSecondPlayer', () => {
            setWaitingForPlayer(true)
        })

        socket.on('leftRoom', onSecondPlayerLeftTheRoom)

        function onSecondPlayerLeftTheRoom() {
            otherPlayerHasLeftTheRoom.current = true
            setTimeout(() => {
                navigate('/play')
            }, 3000)
        }

        const handleDeleteRoom = async () => {
            try {
                await deleteRoomFromMatchingSystem(room)
            } catch (error) {
                console.error(error)
            }
        }

        return () => {
            // Remove the event listener when disassembling the component to avoid memory leaks
            document.removeEventListener('keydown', handleKeyDown)

            if (imPlayerOne === true) {
                handleDeleteRoom()
            }

            socket.emit('leaveRoom', {
                roomId: room,
                userId: userData.user.id,
            })

            if (player_two !== 0) {
                socket.emit('cancelInvitation', {
                    player_two: player_two,
                    room: room,
                })
            }

            socket.off('connect_error')
            socket.off('connect')
            socket.off('secondPlayerJoined')
            socket.off('sendFrames', onReceiveFrames)
            socket.off('waitingForSecondPlayer')
            socket.off('leftRoom', onSecondPlayerLeftTheRoom)
            socket.off('declineInvitation')
        }
    }, [room])

    return (
        <div>
            <div className={styles.scoreContainer}>
                {otherPlayerHasLeftTheRoom.current && (
                    <div className={styles.overlay}>
                        Game Over! The other player has left the room.
                    </div>
                )}
                {gameOver.current && (
                    <div className={styles.overlay}>
                        Game Over! {winner} won!
                    </div>
                )}
                <Player userData={playerOneData} />
                <div id="scorePlayerOne" className={styles.score}>
                    0
                </div>
                <div id="scorePlayerTwo" className={styles.score}>
                    0
                </div>
                <Player userData={playerTwoData} />
            </div>
            <div className={styles.waitingForPlayer}>
                {playerNumber === 'player_one' ? (
                    waitingForPlayer ? (
                        <div>Waiting for the second player...</div>
                    ) : null
                ) : null}
            </div>
            {youHaveBeenRejected && (
                <div className={styles.overlay}>
                    <h4>
                        {playerTwoNameWhenDeclined} has declined your invitation
                    </h4>
                </div>
            )}
            <canvas id="boardGame" className={styles.boardGame}></canvas>
        </div>
    )
}

export default BoardGame
