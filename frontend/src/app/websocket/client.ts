import io from "socket.io-client";

const WebSocketClient = () => {
    const socket = io("localhost:8000", {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("WebSocket connected");
    });

    socket.on("disconnect", () => {
      console.log("WebSocket disconnected");
    });

    return () => {
      socket.disconnect();
    };
};

export default WebSocketClient;
