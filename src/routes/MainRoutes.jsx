import React from "react";
import { createBrowserRouter } from "react-router-dom";

import Event from "../pages/Event";
import Calendar from "../pages/Calendar";
import Discover from "../pages/Discover";
import CreateEvent from "../pages/CreateEvent";
import SignIn from "../pages/SignIn";
import Landing from "../pages/Landing";

import PrivateLayout from "../Layout/PrivateLayout";
import PublicLayout from "../Layout/PublicLayout";
import EventLayout from "../Layout/EventLayout";

import Tech from "../Events/Tech";
import Food from "../Events/Food";
import Ai from "../Events/Ai";
import Arts from "../Events/Arts";
import Climate from "../Events/Climate";
import Fitness from "../Events/Fitness";
import Crypto from "../Events/Crypto";
import Wellness from "../Events/Wellness";

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
        path: "discover",
        element: <Discover />,
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
        path: "calendar",
        element: <Calendar />,
      },
      {
        path: "create-event",
        element: <CreateEvent />,
      },
    ],
  },
  {
    path: "/events",
    element: <EventLayout />,
    children: [
      {
        path: "tech",
        element: <Tech />,
      },
      {
        path: "food",
        element: <Food />,
      },
      {
        path: "ai",
        element: <Ai />,
      },
      {
        path: "arts",
        element: <Arts />,
      },
      {
        path: "climate",
        element: <Climate />,
      },
      {
        path: "fitness",
        element: <Fitness />,
      },
      {
        path: "wellness",
        element: <Wellness />,
      },
      {
        path: "crypto",
        element: <Crypto />,
      },
    ],
  },
]);

export default MainRoutes;
