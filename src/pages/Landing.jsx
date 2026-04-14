import { Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import "../styles/Landing.css";

function Landing() {
  const phone_dark =
    "https://res.cloudinary.com/dzrz3w50w/video/upload/v1776160585/phone-dark_gm468i.mp4";
  return (
    <div>
      <div className="landing-container">
        <div className="landing-section">
          <div className="landing-text">
            {/* Left Section */}
            <Typography className="text-name">Eventix</Typography>

            <Typography className="main-heading">
              Delightful events <br />
              <span className="color-text">start here.</span>
            </Typography>

            <Typography className="sub">
              Set up an event page, invite friends and sell tickets. Host a memorable event today.
            </Typography>
          </div>

          {/* Right Section */}
          <div className="phone">
            <video autoPlay loop muted playsInline>
              <source src={phone_dark} type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
