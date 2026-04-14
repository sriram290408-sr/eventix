import React from "react";
import Navbar from "../components/Navbar";
import { Outlet, Navigate } from "react-router-dom";
import Footer from "../components/Footer";
import { Box, CircularProgress, Divider } from "@mui/material";
import { useAuth } from "../context/AuthContext";

function PrivateLayout() {
  const { isAuthenticated, isAuthReady } = useAuth();

  if (!isAuthReady) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress sx={{ color: "#64a0fa" }} />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div>
      <Navbar />
      <Outlet />

      <Divider
        sx={{
          width: "50%",
          margin: "7px auto",
          borderColor: "white",
        }}
      />

      <Footer />
    </div>
  );
}

export default PrivateLayout;