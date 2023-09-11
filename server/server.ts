

import express, {Express} from "express";
import dotenv from 'dotenv';
import {Server} from "socket.io";
import cors from "cors";
import http from "http";


dotenv.config();


export const app: Express = express();
const server = http.createServer(app);

const port = process.env.PORT || 8000;
const socketIO = new Server(server);

app.use(cors());


socketIO.on("connection", (socket) => {
  console.log("A user connected");

  // Listen for incoming messages
  socket.on("message", (message) => {
    console.log("Received message:", message);

    // Broadcast the message to all connected clients
    socketIO.emit("message", message);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
