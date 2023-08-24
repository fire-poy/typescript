import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Frame } from './entities/pong.entity';
import { Socket, Server } from 'socket.io';
import { UserService } from 'src/user/user.service';
export declare class PongGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private userService;
    constructor(userService: UserService);
    private loger;
    private frameIntervals;
    private pongServices;
    private waitingForSecondPlayer;
    private secondPlayerIds;
    server: Server;
    afterInit(server: any): void;
    handleConnection(client: Socket, ...args: any[]): void;
    handleDisconnect(client: Socket): void;
    handleCreateRoom(client: Socket, roomId: string): void;
    handleJoinRoom(client: Socket, [roomId, playerId]: [string, number]): void;
    private emitSecondPlayerJoined;
    handleLeaveRoom(client: Socket, data: {
        roomId: string;
        userId: number;
    }): void;
    private startGame;
    sendFrameToRoom(roomId: string, frame: Frame): void;
    handleMovePaddle(client: Socket, data: {
        player: string;
        direction: string;
        roomId: string;
    }): void;
    handleGetFrame(client: Socket, roomId: string): Frame;
    handleStartGame(client: Socket, roomId: string): void;
    handleResetGame(client: Socket, data: {
        userId: number;
    }): void;
    handleSendInvitation(client: Socket, data: {
        player_one_nickname: string;
        player_one_id: number;
        player_two: number;
        room: string;
    }): void;
    handleCancelInvitation(client: Socket, data: {
        player_two: number;
        room: string;
    }): void;
    handleDeclineInvitation(client: Socket, data: {
        player_one: number;
        player_two: string;
        room: string;
    }): void;
}
