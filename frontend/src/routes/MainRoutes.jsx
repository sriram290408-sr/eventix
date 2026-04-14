import React from "react";
import { createBrowserRouter } from "react-router-dom";

import Event from "../pages/Event";
import MyEvent from "../pages/MyEvent";
import Discover from "../pages/Discover";
import CreateEvent from "../pages/CreateEvent";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Landing from "../pages/Landing";
import Profile from "../pages/Profile";
import EventDetails from "../pages/EventDetails";
import CategoryEvents from "../pages/CategoryEvent";

import PrivateLayout from "../Layout/PrivateLayout";
import PublicLayout from "../Layout/PublicLayout";

const MainRoutes = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "signin",
        element: <SignIn />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
    ],
  },

  {
    path: "/private",
    element: <PrivateLayout />,
    children: [
      {
        path: "event",
        element: <Event />,
      },
      {
        path: "event/:slug",
        element: <EventDetails />,
      },
      {
        path: "my-event",
        element: <MyEvent />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "create-event",
        element: <CreateEvent />,
      },
      {
        path: "discover",
        element: <Discover />,
      },
      {
        path: "discover/:category",
        element: <CategoryEvents />,
      },
    ],
  },
]);

export default MainRoutes;