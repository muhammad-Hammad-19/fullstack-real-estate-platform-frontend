import { io } from "socket.io-client";

// Vite hamesha import.meta.env use karta hai
const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
// 💡 Yaad se 3000 ya jo bhi aapka Node.js backend port hai wo rakhna, 5173 nahi.

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false, // Double connection aur performance bugs se bachne ke liye
  transports: ["websocket", "polling"],
});
