// UserContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

// Context create
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // State
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null,
  );

  // Separate function state update ke liye
  const updateUser = (newData) => {
    setUser(newData);
  };
  
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useUser = () => {
  return useContext(AuthContext);
};
