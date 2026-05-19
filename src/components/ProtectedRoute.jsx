import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/AuthContext"; // Aapka auth context

const ProtectedRoute = () => {
  const { user } = useUser();

  // Agar user logged in nahi hai, to use login page par redirect kar do
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Agar user hai, to andar wale saare child components render karo
  return <Outlet />;
};

export default ProtectedRoute;