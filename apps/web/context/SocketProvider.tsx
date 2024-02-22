"use client";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
interface SocketProviderProp {
  children?: React.ReactNode;
}

interface ISocketContext {
  sendMessage: (msg: string) => any;
  messages: string[];
}
const SocketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) throw new Error("undefined state");

  return state;
};
export const SocketProvider: React.FC<SocketProviderProp> = ({ children }) => {
  const [socket, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<string[]>([]);
  const sendMessage: ISocketContext["sendMessage"] = useCallback(
    (msg) => {
      console.log("send message", msg);
      if (socket) {
        socket.emit("event:message", { message: msg });
      } else {
        console.log("Socket not initialized yet.");
      }
    },
    [socket]
  );
  const onMessageRec = useCallback((msg: string) => {
    console.log("From Server Msg Rec", msg);
    const message = JSON.parse(msg);
    setMessages((prevMessages) => [...prevMessages, message.message]);
  }, []);
  useEffect(() => {
    const _socket = io("http://localhost:8000"); // server address
    _socket.on("message", onMessageRec);
    // _socket.on("private message", (data) => {
    //   // Handle the received private message
    //   console.log(
    //     "Received private message from " + data.senderId + ": " + data.message
    //   );
    // });
    _socket.on("connect", () => {
      console.log("Connected to server");
      //     _socket.emit("event:message", { message: "Hello from the client!" });
      setSocket(_socket); // error not working
      console.log(socket);
    });
    //setSocket(_socket);
    return () => {
      console.log("socket disconnect ..");
      _socket.off("message", onMessageRec);
      _socket.disconnect();
      setSocket(undefined);
    };
  }, []);
  return (
    <SocketContext.Provider value={{ sendMessage, messages }}>
      {children}
    </SocketContext.Provider>
  );
};
