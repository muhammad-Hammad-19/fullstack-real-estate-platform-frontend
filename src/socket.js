import { io } from "socket.io-client";
import { SOCKET_URL } from "./lib/config";

export const socket = SOCKET_URL
  ? io(SOCKET_URL, {
      withCredentials: true,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    })
  : null;

if (socket) {
  socket.on("connect", () => {
    console.log("Frontend connected to Socket Server! ID:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected from server. Reason:", reason);
  });
}
