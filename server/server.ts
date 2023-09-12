import express, {Express} from "express";
import dotenv from 'dotenv';
import {Server, Socket} from "socket.io";
import cors from "cors";
import http from "http";
import { DefaultEventsMap } from "socket.io/dist/typed-events";


dotenv.config();


export const app: Express = express();
const server = http.createServer(app);

const port = process.env.PORT || 8000;
const socketIO = new Server(server);

app.use(cors());

interface Match {
  address: String;
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
}

interface GameState {

}

const waitingPlayers: Match[] = []; // Array to store waiting players

socketIO.on("connect", (socket) => {
  console.log(`A user connected ${socket.id}`);

  // Listen for incoming messages
  socket.on("joinMatch", (address) => {
    waitingPlayers.push({address, socket});
    console.log("Received address:", address);
  });
  
  socket.on("initGame", () => {
    
  })

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    socket.disconnect(true);
    const index = waitingPlayers.map((player, idx) => {
      if (player.socket.id === socket.id) {
        return idx;
      }
    })[0];
    if (index) {
      waitingPlayers.splice(index, 1);
    }
  });
});

server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
