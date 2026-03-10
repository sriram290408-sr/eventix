import React from "react";
import Sign_nav from "../components/Sign_nav";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
import { Divider } from "@mui/material";

function PublicLayout() {
  return (
    <div>
      <Sign_nav />
      <Outlet />
    </div>
  );
}

export default PublicLayout;
