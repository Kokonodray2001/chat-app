"use client";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
interface SocketProviderProp {
  children?: React.ReactNode;
}

interface ISocketContext {
  sendMessage: (msg: string) => any;
}
const SocketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) throw new Error("undefined state");

  return state;
};
export const SocketProvider: React.FC<SocketProviderProp> = ({ children }) => {
  const [socket, setSocket] = useState<Socket>();

  const sendMessage: ISocketContext["sendMessage"] = useCallback((msg) => {
    console.log("send message", msg);
    if (socket) {
      socket.emit("event:message", { message: msg });
    } else {
      console.log("Socket not initialized yet.");
    }
  }, []);

  useEffect(() => {
    const _socket = io("http://localhost:8000"); // server address
    // _socket.emit("event:message", { message: "Hello from the client!" });
    _socket.on("connect", () => {
      console.log("Connected to server");
      setSocket(_socket); // error not working
    });
    //setSocket(_socket);
    return () => {
      console.log("socket disconnect ..");
      _socket.disconnect();
      setSocket(undefined);
    };
  }, []);
  return (
    <SocketContext.Provider value={{ sendMessage }}>
      {children}
    </SocketContext.Provider>
  );
};
