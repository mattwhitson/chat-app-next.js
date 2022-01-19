import { createContext } from "react";
import { io } from "socket.io-client";

export const socket = io("wss://www.mattdwhitson.com", {
  path: "/api/socket",
});
export const SocketContext = createContext();
