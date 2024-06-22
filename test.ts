import { Server } from "socket.io";
import {io} from "socket.io-client";

const server_io = new Server(3000, { /* options */ });

server_io.on("connection", (socket) => {
  socket.on("playerJoin", (playerId: string, playerName: string) => {
    console.log(`player ${playerName} joined`);
  });
});


const socket = io("http://localhost:3000");
socket.emit("playerJoin", "1", "John Doe");