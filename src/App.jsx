import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Layouts
import { Layout } from "./pages/layout/Layout";

// Pages
import HomePage from "./pages/home/HomePage";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import ProfileUpdate from "./pages/profileUpdate/ProfileUpdate";
import ProfilePage from "./pages/profile/ProfilePage";
import ListPage from "./pages/listPage/ListPage";
import SinglePage from "./pages/singlePage/SinglePage";
import NewPostPage from "./pages/newPostPage/NewPostPage";
import PublicRoute from "./components/PublicRoute";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        // 🌍 PUBLIC ROUTES (Inhein har koi dekh sakta hai)
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/list",
          element: <ListPage />,
        },
        {
          path: "/list/:id",
          element: <SinglePage />,
        },

        {
          element: <PublicRoute />,
          children: [
            {
              path: "/auth/login",
              element: <Login />,
            },
            {
              path: "/auth/signup",
              element: <Signup />,
            },
          ],
        },

        // 🔒 PROTECTED ROUTES (Sirf logged-in users ke liye)
        {
          element: <ProtectedRoute />,
          children: [
            {
              path: "/profile",
              element: <ProfilePage />,
            },
            {
              path: "/profile/update",
              element: <ProfileUpdate />,
            },
            {
              path: "/post/create",
              element: <NewPostPage />,
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
