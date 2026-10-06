import { io, type Socket } from "socket.io-client";

class SocketService {
    private static instance: SocketService;
    public socket: Socket;

    private constructor() {
        this.socket = io("http://localhost:4001");
    }

    public static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }

        return SocketService.instance;
    }
}

export default SocketService;