import { useEffect } from "react";
import io from "socket.io-client";

const WebSocketClient = () => {
  // useEffect(() => {
  //   const socket = io("localhost:8000", {
  //     transports: ["websocket"],
  //   });

  //   socket.on("connect", () => {
  //     console.log("WebSocket connected");
  //   });

  //   socket.on("matchFound", (data) => {
  //     console.log("Match found!");
  //     console.log("Opponent:", data.opponent);
  //   });

  //   socket.on("disconnect", () => {
  //     console.log("WebSocket disconnected");
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  return null;
};

export default WebSocketClient;
