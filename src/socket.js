import { io } from "socket.io-client";

// URL aapke backend server ka hai
const URL = "http://localhost:3000";

export const socket = io(URL, {
  withCredentials: true,
  autoConnect: true, // 💥 Automatically connect karega jaise hi app load hogi
  reconnection: true, // 💥 Agar disconnect ho toh khud ba khud reconnect karega
  reconnectionAttempts: 10, // 💥 10 dafa try karega connect karne ki back-to-back
  reconnectionDelay: 1000, // 💥 Har 1 second baad try karega taake server par load na aaye
});

// Debugging ke liye (Aapke browser ke console mein dikhega ke socket chal raha hai ya nahi)
socket.on("connect", () => {
  console.log(
    "⚡ Frontend successfully connected to Socket Server! ID:",
    socket.id,
  );
});

socket.on("disconnect", (reason) => {
  console.log("❌ Socket disconnected from server. Reason:", reason);
});
