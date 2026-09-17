// UserContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { socket } from "../socket";
import { useNotificationStore } from "../lib/notificationStore";

// Context create
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // State
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch (e) {
      return null;
    }
  });

  // Separate function state update ke liye
  const updateUser = (newData) => {
    setUser(newData);
  };
  
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Global socket registration and notification listener
  useEffect(() => {
    if (user && socket) {
      const userId = user.id || user.userId || user._id;
      
      const registerUser = () => {
        console.log("⚡ Registering user on global socket:", userId);
        socket.emit("register", userId);
      };

      if (socket.connected) {
        registerUser();
      }
      
      socket.on("connect", registerUser);

      const handleGlobalMessage = (data) => {
        console.log("📩 Global message received on socket:", data);
        // Only increase count if the user is not on the profile page
        if (window.location.pathname !== "/profile") {
          useNotificationStore.getState().increase();
        }
      };

      socket.on("getMessage", handleGlobalMessage);

      return () => {
        socket.off("connect", registerUser);
        socket.off("getMessage", handleGlobalMessage);
      };
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        updateUser,
        socket,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useUser = () => {
  return useContext(AuthContext);
};

