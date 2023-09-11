"use client"

import { useState } from "react";
import WebSocketClient from "./websocket/client";
import { Button } from "@chakra-ui/react";
import io from 'socket.io-client';

export default function Home() {
  const [data, setData] = useState<String[]>([]);
  const newSocket = io('localhost:8000', {
    transports: ["websocket"],
  });

     const handleDataReceived = (newData: String) => {
       setData((prevData: String[]) => [...prevData, newData]);
     };
     const handleClick = () => {
      console.log("clicked");
      newSocket.emit("message", "hello");
     }

     return (
       <div>
        Display ws msg:
         {data.map((item, index) => (
           <div key={index}>{item}</div>
         ))}
         <Button onClick={handleClick}>web socket BUTTON</Button>
         <WebSocketClient onDataReceived={handleDataReceived} />
       </div>
     );
}
