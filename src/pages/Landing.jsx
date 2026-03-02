import React from "react";
import Sign_nav from "../components/Sign_nav";
import { Typography, Button } from "@mui/material";
import "../styles/Landing.css";

function Landing() {
  return (
    <div className="landing-container">

      <Sign_nav />

      <div className="landing-section">

        <div className="landing-text">

          <Typography className="text-name">
            Eventix
          </Typography>

          <Typography className="main-heading">
            Delightful events <br />
            <span className="color-text">start here.</span>
          </Typography>

          <Typography className="sub">
            Set up an event page, invite friends and sell tickets.
            Host a memorable event today.
          </Typography>

          <Button className="btn">
            Create Your First Event
          </Button>

        </div>

        <div className="phone">
          <video autoPlay loop muted playsInline>
            <source src="/src/assets/phone-dark.mp4" type="video/mp4" />
          </video>
        </div>

      </div>
    </div>
  );
}

export default Landing;