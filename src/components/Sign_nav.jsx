import React from "react";
import { AppBar, Toolbar, Button, Typography, Stack } from "@mui/material";
import "../styles/Navbar.css";
import Clock from "./Clock";
import { Link } from "react-router-dom";

function Sign_nav() {
  return (
    <AppBar position="sticky" color="transparent" elevation={0}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography sx={{ fontSize: "30px", fontWeight: "bold" }}>✦</Typography>

        <Stack
          direction="row"
          spacing={3}
          sx={{
            flexGrow: 1,
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Clock />

          <Button
            component={Link}
            to="/discover"
            sx={{
              color: "grey",
              textTransform: "none",
              fontSize: "17px",
            }}
          >
            Explore Events ↗
          </Button>

          <Button
            component={Link}
            to="/SignIn"
            sx={{
              display: "flex",
              alignItems: "center",
              padding: "7px",
              color: "white",
              backgroundColor: "grey",
              borderRadius: "50px",
              fontSize: "14px",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#555",
              },
            }}
          >
            Sign In
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default Sign_nav;
