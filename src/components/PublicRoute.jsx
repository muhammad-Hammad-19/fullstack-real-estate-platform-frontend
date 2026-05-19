import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/AuthContext";

const PublicRoute = () => {
  const { user } = useUser();

  // Agar user pehle se logged in hai, to use login/register par mat jaane do
  if (user) {
    return <Navigate to="/profile" replace />;
  }

  // Agar logged in nahi hai, to login/register page dikhao
  return <Outlet />;
};

export default PublicRoute;