import React from "react";
import "../styles/Navbar.css";
import { AppBar, Toolbar, Button, Typography, Stack } from "@mui/material";
import Clock from "./Clock";
import { Link } from "react-router-dom";

function Sign_nav() {
  return (
    <AppBar position="static" id="app">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>

        <Typography sx={{ fontSize: "30px", fontWeight: "bold" }}>
          ✦
        </Typography>

        <Stack
          direction="row"
          spacing={3}
          sx={{
            flexGrow: 1,
            justifyContent: "flex-end",
            alignItems: "center"
          }}
        >
          <Clock />

          <Button
            sx={{
              color: "grey",
              textTransform: "none",
              fontSize: "17px",
            }}
          >
            Explore Events ↗
          </Button>

          <Button
            // component={Link}
            // to="/SignIn"
            sx={{
              color: "white",
              backgroundColor: "grey",
              borderRadius: "50px",
              padding: "6px 18px",
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