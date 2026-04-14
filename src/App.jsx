import React from "react";
import "./App.css";
import MainRoutes from "./routes/MainRoutes";
import { RouterProvider } from "react-router-dom";

function App() {
  return (
    <div >
        <RouterProvider router={MainRoutes} />
    </div>
  );
}

export default App;
