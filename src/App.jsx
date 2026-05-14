import React from "react";
import Navbar from "./components/Navbar/Navbar";

import {
  createBrowserRouter,
  Route,
  RouterProvider,
  Link,
} from "react-router-dom";

import HomePage from "./pages/home/HomePage";
import { Layout } from "./pages/layout/Layout";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import ProfileUpdate from "./pages/profileUpdate/ProfileUpdate";
import ProfilePage from "./pages/profile/ProfilePage";
const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/auth/login",
          element: <Login />,
        },
        {
          path: "/auth/signup",
          element: <Signup />,
        },
        {
          path: "/profile/update",
          element: <ProfileUpdate />,
        },
        {
          path: "/profile",
          element: <ProfilePage />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default App;
