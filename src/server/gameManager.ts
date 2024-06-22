import { Server, Socket } from "socket.io";

export enum GamePhase {
    LOBBY,
    SETUP,
    PLAY,
    END
}

export type Player = {
    id: string;
    name: string;
    color: string;
    ready: boolean;
    socket: Socket;
}

export class GameManager {
    public gamePhase: GamePhase = GamePhase.LOBBY;
    public players: Map<string, Player> = new Map();
    public room: string;
    public io: Server;

    constructor(room: string, io: Server) {
        this.room = room;
        this.io = io;
        this.io.on('connect', this.registerEvents.bind(this));
    }

    private registerEvents = (socket: Socket) => {
        socket.on('playerJoin', (playerId: string, playerName: string) => this.onPlayerJoin(socket, playerId, playerName));
        socket.on('playerReady', (playerId: string) => this.onPlayerReady(playerId));
        socket.on('disconnect', () => this.removePlayer(socket.id));
    }

    private addPlayer(player: Player) {
        this.players.set(player.id, player);
        
        for (const [_, player] of this.players)
            player.ready = false;

        this.io.emit('playerJoined', player);
    }

    private removePlayer(playerId: string) {
        this.players.delete(playerId);
        
        for (const [_, player] of this.players)
            player.ready = false;

        this.io.emit('playerLeft', playerId);
    }

    private onPlayerJoin(socket: Socket, playerId: string, playerName: string) {
        const player: Player = {
            id: playerId,
            name: playerName,
            color: 'white', // TODO: random color
            ready: false,
            socket
        };
        this.addPlayer(player);
    }


    private onPlayerReady(playerId: string) {
        const player = this.players.get(playerId);
        if (player) {
            player.ready = true;
            this.io.emit('playerReady', player);
        }
    }
}