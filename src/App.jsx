import React from "react";
import "./App.css";
import MainRoutes from "./routes/MainRoutes";
import { RouterProvider } from "react-router-dom";
import Landing from "./pages/Landing";
import Event from "./pages/Event"

function App() {
  return <RouterProvider router={MainRoutes}></RouterProvider>;
  // return <Landing />;
}

export default App;
