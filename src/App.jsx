import React from "react";
import Navbar from "./components/Navbar/Navbar";

import {
  createBrowserRouter,
  Route,
  RouterProvider,
  Link,
} from "react-router-dom";

// import ListPage from "./routes/listpage/ListPage";
import HomePage from "./pages/home/HomePage";
import { Layout } from "./pages/layout/Layout";
// import SinglePage from "./routes/singlepage/SinglePage";
// import ProfilePage from "./routes/profilePage/ProfilePage";

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
        // {
        //   path: "/list",
        //   element : <ListPage/>
        // },
        //  {
        //   path: "/:id",
        //   element : <SinglePage/>
        // },
        // {
        //   path: "/profile",
        //   element : <ProfilePage/>
        // }
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default App;
