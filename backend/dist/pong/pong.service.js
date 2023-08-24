"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PongService = void 0;
const common_1 = require("@nestjs/common");
const FRAME_WIDTH = 300;
const FRAME_HEIGHT = 150;
const PADDLE_WIDTH = 2;
const PADDLE_HEIGHT = 30;
const TOP_SCORE = 10;
let PongService = class PongService {
    constructor() {
        this.BALL_SIZE = 2;
        this.PADDLE_SPEED = 2;
        this.BALL_SPEED_Y = 1;
        this.BALL_SPEED_X = 1;
        this.frame = {
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
        };
        this.gameActive = true;
    }
    startGame() {
        this.gameActive = true;
        this.frame.score.playerOne = 0;
        this.frame.score.playerTwo = 0;
        this.frame.ball.position.x = FRAME_WIDTH / 2;
        this.frame.ball.position.y = FRAME_HEIGHT / 4;
        this.frame.gameOver = false;
    }
    resetGame() {
        this.gameActive = false;
        this.frame.score.playerOne = 0;
        this.frame.score.playerTwo = 0;
        this.frame.ball.position.x = FRAME_WIDTH / 2;
        this.frame.ball.position.y = FRAME_HEIGHT / 4;
        this.frame.gameOver = false;
    }
    simpleFrame() {
        return this.frame;
    }
    updateFrame(player, direction) {
        if (player === 'player_one') {
            if (direction === 'up' && this.frame.paddleLeft.position.y > 0) {
                this.frame.paddleLeft.position.y -= this.PADDLE_SPEED;
            }
            else if (direction === 'down' &&
                this.frame.paddleLeft.position.y +
                    this.frame.paddleLeft.size.height <
                    FRAME_HEIGHT) {
                this.frame.paddleLeft.position.y += this.PADDLE_SPEED;
            }
        }
        else if (player === 'player_two') {
            if (direction === 'up' && this.frame.paddleRight.position.y > 0) {
                this.frame.paddleRight.position.y -= this.PADDLE_SPEED;
            }
            else if (direction === 'down' &&
                this.frame.paddleRight.position.y +
                    this.frame.paddleRight.size.height <
                    FRAME_HEIGHT) {
                this.frame.paddleRight.position.y += this.PADDLE_SPEED;
            }
        }
        return this.frame;
    }
    updateFrameLogic() {
        if (!this.gameActive) {
            return;
        }
        this.frame.ball.position.x += this.BALL_SPEED_X;
        this.frame.ball.position.y += this.BALL_SPEED_Y;
        if (this.frame.ball.position.y + this.BALL_SIZE >= FRAME_HEIGHT ||
            this.frame.ball.position.y <= 0) {
            this.BALL_SPEED_Y *= -1;
        }
        if (this.frame.ball.position.x <=
            this.frame.paddleLeft.position.x + PADDLE_WIDTH &&
            this.frame.ball.position.y + this.BALL_SIZE / 2 >=
                this.frame.paddleLeft.position.y &&
            this.frame.ball.position.y + this.BALL_SIZE / 2 <=
                this.frame.paddleLeft.position.y + PADDLE_HEIGHT &&
            this.frame.ball.position.x >= this.frame.paddleLeft.position.x) {
            this.BALL_SPEED_X *= -1;
            this.frame.ball.position.x =
                this.frame.paddleLeft.position.x + PADDLE_WIDTH;
        }
        else if (this.frame.ball.position.x + this.BALL_SIZE >=
            this.frame.paddleRight.position.x &&
            this.frame.ball.position.y + this.BALL_SIZE / 2 >=
                this.frame.paddleRight.position.y &&
            this.frame.ball.position.y + this.BALL_SIZE / 2 <=
                this.frame.paddleRight.position.y + PADDLE_HEIGHT &&
            this.frame.ball.position.x <= this.frame.paddleRight.position.x) {
            this.BALL_SPEED_X *= -1;
            this.frame.ball.position.x =
                this.frame.paddleRight.position.x - PADDLE_WIDTH;
        }
        if (this.frame.ball.position.x + this.BALL_SIZE >= FRAME_WIDTH) {
            this.frame.ball.position.x = FRAME_WIDTH / 2;
            this.frame.ball.position.y = FRAME_HEIGHT / 2;
            this.frame.score.playerOne += 1;
        }
        else if (this.frame.ball.position.x <= 0) {
            this.frame.ball.position.x = FRAME_WIDTH / 2;
            this.frame.ball.position.y = FRAME_HEIGHT / 2;
            this.frame.score.playerTwo += 1;
        }
        if (this.frame.score.playerOne >= TOP_SCORE ||
            this.frame.score.playerTwo >= TOP_SCORE) {
            this.gameActive = false;
            this.frame.gameOver = true;
            return;
        }
    }
    getFrame() {
        this.updateFrameLogic();
        return this.frame;
    }
};
PongService = __decorate([
    (0, common_1.Injectable)()
], PongService);
exports.PongService = PongService;
//# sourceMappingURL=pong.service.js.map