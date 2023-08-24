import { io, Socket } from 'socket.io-client'

class SocketGameService {
    private static instance: SocketGameService
    private socket: Socket | null = null

    private constructor() {}

    public static getInstance(): SocketGameService {
        if (!SocketGameService.instance) {
            SocketGameService.instance = new SocketGameService()
        }

        return SocketGameService.instance
    }

    connect(): Socket {
        if (!this.socket) {
            this.socket = io('http://localhost:8080/game')
        }

        return this.socket
    }
}

export default SocketGameService
