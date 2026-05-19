// UserContext.jsx (Ya AuthContext.jsx jo aap use kar rahe hain)
import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const AuthSocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  // 1. Safe User State Setup
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch (e) {
      return null;
    }
  });

  const [socket, setSocket] = useState(null);

  // 2. Global Level Par Single Socket Instance Engine
  useEffect(() => {
    if (!user) {
      // Agar user logout ho jaye to socket disconnect kar do
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const currentUserId = user.id || user.userId || user._id;

    // Single pipeline connection initialize
    const socketInstance = io("http://localhost:3000", {
      withCredentials: true,
    });

    socketInstance.on("connect", () => {
      console.log("⚡ Secure Socket Pipeline Connected:", socketInstance.id);
      // Connected hote hi user register karwao
      socketInstance.emit("register", currentUserId);
    });

    setSocket(socketInstance);

    // Cleanup on unmount or user change
    return () => {
      socketInstance.disconnect();
    };
  }, [user]);

  // User details update karne ka function
  const updateUser = (data) => {
    if (data) {
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
    } else {
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  return (
    <AuthSocketContext.Provider value={{ user, updateUser, socket }}>
      {children}
    </AuthSocketContext.Provider>
  );
};

// 🎯 Yeh hook ab user aur socket dono safely return karega
export const useUser = () => {
  const context = useContext(AuthSocketContext);
  if (!context) {
    throw new Error("useUser must be used within a SocketProvider");
  }
  return context;
};
