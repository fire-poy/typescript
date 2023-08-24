import { Frame } from './entities/pong.entity';
export declare class PongService {
    BALL_SIZE: number;
    PADDLE_SPEED: number;
    BALL_SPEED_Y: number;
    BALL_SPEED_X: number;
    frame: Frame;
    gameActive: boolean;
    startGame(): void;
    resetGame(): void;
    simpleFrame(): Frame;
    updateFrame(player: string, direction: string): Frame;
    updateFrameLogic(): void;
    getFrame(): Frame;
}
