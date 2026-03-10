import React from "react";
import Navbar from "../components/Navbar";
import { Divider } from "@mui/material";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

function EventLayout() {
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

export default EventLayout;
