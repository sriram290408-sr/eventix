import React from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import { Divider } from "@mui/material";

function PrivateLayout() {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Divider
        sx={{
          width: "50%",
          margin: "7px 0",
          borderColor: "white",
        }}
      />
      <Footer />
    </div>
  );
}

export default PrivateLayout;
