import { Injectable } from '@nestjs/common'
import { Frame } from './entities/pong.entity'

const FRAME_WIDTH: number = 300
const FRAME_HEIGHT: number = 150
const PADDLE_WIDTH: number = 2
const PADDLE_HEIGHT: number = 30
const TOP_SCORE: number = 10

@Injectable()
export class PongService {
    BALL_SIZE: number = 2
    PADDLE_SPEED: number = 2
    BALL_SPEED_Y: number = 1
    BALL_SPEED_X: number = 1

    frame: Frame = {
        paddleLeft: {
            position: {
                x: 10,
                y: 60,
            },
            size: {
                width: PADDLE_WIDTH,
                height: PADDLE_HEIGHT,
            },
        },
        paddleRight: {
            position: {
                x: 280,
                y: 60,
            },
            size: {
                width: PADDLE_WIDTH,
                height: PADDLE_HEIGHT,
            },
        },
        ball: {
            position: {
                x: 50,
                y: 50,
            },
            size: {
                width: this.BALL_SIZE,
                height: this.BALL_SIZE,
            },
        },
        score: { playerOne: 0, playerTwo: 0 },
        gameOver: false,
    }

    gameActive: boolean = true

    startGame(): void {
        this.gameActive = true
        this.frame.score.playerOne = 0
        this.frame.score.playerTwo = 0
        this.frame.ball.position.x = FRAME_WIDTH / 2
        this.frame.ball.position.y = FRAME_HEIGHT / 4
        this.frame.gameOver = false
    }

    resetGame(): void {
        this.gameActive = false
        this.frame.score.playerOne = 0
        this.frame.score.playerTwo = 0
        this.frame.ball.position.x = FRAME_WIDTH / 2
        this.frame.ball.position.y = FRAME_HEIGHT / 4
        this.frame.gameOver = false
    }

    simpleFrame(): Frame {
        return this.frame
    }

    updateFrame(player: string, direction: string): Frame {
        // Update the position of the pallet according to the direction provided
        if (player === 'player_one') {
            if (direction === 'up' && this.frame.paddleLeft.position.y > 0) {
                this.frame.paddleLeft.position.y -= this.PADDLE_SPEED
            } else if (
                direction === 'down' &&
                this.frame.paddleLeft.position.y +
                    this.frame.paddleLeft.size.height <
                    FRAME_HEIGHT
            ) {
                this.frame.paddleLeft.position.y += this.PADDLE_SPEED
            }
        } else if (player === 'player_two') {
            if (direction === 'up' && this.frame.paddleRight.position.y > 0) {
                this.frame.paddleRight.position.y -= this.PADDLE_SPEED
            } else if (
                direction === 'down' &&
                this.frame.paddleRight.position.y +
                    this.frame.paddleRight.size.height <
                    FRAME_HEIGHT
            ) {
                this.frame.paddleRight.position.y += this.PADDLE_SPEED
            }
        }
        return this.frame
    }

    updateFrameLogic() {
        if (!this.gameActive) {
            return
        }
        this.frame.ball.position.x += this.BALL_SPEED_X
        this.frame.ball.position.y += this.BALL_SPEED_Y

        // Reverse vertical direction if it reaches the vertical limits of the screen
        if (
            this.frame.ball.position.y + this.BALL_SIZE >= FRAME_HEIGHT ||
            this.frame.ball.position.y <= 0
        ) {
            this.BALL_SPEED_Y *= -1
        }

        // COLLISION LOGIC
        // left paddle
        if (
            this.frame.ball.position.x <=
                this.frame.paddleLeft.position.x + PADDLE_WIDTH &&
            this.frame.ball.position.y + this.BALL_SIZE / 2 >=
                this.frame.paddleLeft.position.y &&
            this.frame.ball.position.y + this.BALL_SIZE / 2 <=
                this.frame.paddleLeft.position.y + PADDLE_HEIGHT &&
            this.frame.ball.position.x >= this.frame.paddleLeft.position.x
        ) {
            this.BALL_SPEED_X *= -1
            // Adjust the ball's position to be outside of the paddle
            this.frame.ball.position.x =
                this.frame.paddleLeft.position.x + PADDLE_WIDTH
            // right paddle
        } else if (
            this.frame.ball.position.x + this.BALL_SIZE >=
                this.frame.paddleRight.position.x &&
            this.frame.ball.position.y + this.BALL_SIZE / 2 >=
                this.frame.paddleRight.position.y &&
            this.frame.ball.position.y + this.BALL_SIZE / 2 <=
                this.frame.paddleRight.position.y + PADDLE_HEIGHT &&
            this.frame.ball.position.x <= this.frame.paddleRight.position.x
        ) {
            this.BALL_SPEED_X *= -1
            // Adjust the ball's position to be outside of the paddle
            this.frame.ball.position.x =
                this.frame.paddleRight.position.x - PADDLE_WIDTH
        }

        // Reset the position of the ball when it leaves the playing field
        if (this.frame.ball.position.x + this.BALL_SIZE >= FRAME_WIDTH) {
            this.frame.ball.position.x = FRAME_WIDTH / 2
            this.frame.ball.position.y = FRAME_HEIGHT / 2
            this.frame.score.playerOne += 1
        } else if (this.frame.ball.position.x <= 0) {
            this.frame.ball.position.x = FRAME_WIDTH / 2
            this.frame.ball.position.y = FRAME_HEIGHT / 2
            this.frame.score.playerTwo += 1
        }

        if (
            this.frame.score.playerOne >= TOP_SCORE ||
            this.frame.score.playerTwo >= TOP_SCORE
        ) {
            this.gameActive = false
            this.frame.gameOver = true
            return
        }
    }

    getFrame(): Frame {
        this.updateFrameLogic()
        return this.frame
    }
}
