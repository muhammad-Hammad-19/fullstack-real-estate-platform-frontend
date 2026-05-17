// UserContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

// Context create
const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  // State
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null,
  );

  const [socket, setSocket] = useState(null);

  const currentUserId = user.id || user.userId;

  useEffect(() => {
    const socketInstance = io("http://localhost:3000", {
      withCredentials: true, // Agar cookies/sessions headers backend par pass karne hon
    });

    setSocket(socketInstance);
    
    // Cleanup: Jab component unmount ho to purana connection close ho jaye
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    user && socket?.emit("register", currentUserId);
  }, [user, socket]);

  return (
    <SocketContext.Provider
      value={{
        socket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useUser = () => {
  return useContext(SocketContext);
};
