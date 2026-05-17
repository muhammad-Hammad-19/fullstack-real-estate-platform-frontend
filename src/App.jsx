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

import ListPage from "./pages/listPage/ListPage";
import SinglePage from "./pages/singlePage/SinglePage";

import NewPostPage from "./pages/newPostPage/NewPostPage";
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
        {
          path: "/profile",
          element: <ProfilePage />,
        },
        {
          path: "/post/create",
          element: <NewPostPage />,
        },
        {
          path: "/list",
          element: <ListPage />,
        },
        {
          path: "/list/:id",
          element: <SinglePage />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default App;
