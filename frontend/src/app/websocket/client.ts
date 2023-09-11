import { useEffect } from 'react';
import io from 'socket.io-client';

const WebSocketClient = ({ onDataReceived }: {onDataReceived: (newData: any) => void}) => {
  useEffect(() => {
    const socket = io("localhost:8000", {
        transports: ["websocket"],
      });

    socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    socket.on('message', (data) => {
      onDataReceived(data);
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, [onDataReceived]);

  return null;
};

export default WebSocketClient;