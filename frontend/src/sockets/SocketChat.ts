import { io, Socket } from 'socket.io-client'

class SocketChatService {
    private static instance: SocketChatService
    private socket: Socket | null = null

    private constructor() {}

    public static getInstance(): SocketChatService {
        if (!SocketChatService.instance) {
            SocketChatService.instance = new SocketChatService()
        }

        return SocketChatService.instance
    }

    connect(): Socket {
        if (!this.socket) {
            this.socket = io('http://localhost:8080/chat')
        }

        return this.socket
    }
}

export default SocketChatService
