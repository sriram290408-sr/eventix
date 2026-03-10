import React, { useState } from "react";
import {
  ExitToAppRounded,
  PhoneAndroidOutlined,
  EmailOutlined,
  Google,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { Button, Typography, Divider, TextField } from "@mui/material";

import "../styles/SignIn.css";

function SignIn() {
  const [sign, setSign] = useState("mail");

  return (
    <div>
      <div className="signin-page">
        <div className="signin-card">
          <Button
            component={Link}
            to={"/"}
            sx={{
              display: "flex",
              justifyContent: "start",
              width: "fit-content",
            }}
          >
            <ExitToAppRounded className="icon-box" />
          </Button>

          <Typography variant="h5" className="title">
            Welcome to Eventix
          </Typography>

          <Typography className="subtitle">
            Please sign in or sign up below.
          </Typography>

          {sign === "mail" && (
            <div className="form-box">
              <div className="toggle-row">
                <Typography>Email</Typography>

                <Typography className="switch" onClick={() => setSign("phone")}>
                  <PhoneAndroidOutlined fontSize="small" />
                  Use Phone Number
                </Typography>
              </div>

              <TextField
                placeholder="you@email.com"
                fullWidth
                className="input"
                type="text"
                sx={{
                  backgroundColor: "white",
                  borderRadius: "6px",
                  "& .MuiOutlinedInput-root": {
                    height: "45px",
                    fontSize: "12px",
                    borderColor: "black",
                  },
                }}
              />

              <Button
                className="main-btn"
                sx={{
                  color: "black",
                  backgroundColor: "white",
                  width: "100%",
                  height: "35px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                Continue with Email
              </Button>
            </div>
          )}

          {sign === "phone" && (
            <div className="form-box">
              <div className="toggle-row">
                <Typography>Phone</Typography>

                <Typography className="switch" onClick={() => setSign("mail")}>
                  <EmailOutlined fontSize="small" />
                  Use Email
                </Typography>
              </div>

              <TextField
                placeholder="+91 9876543210"
                fullWidth
                className="input"
                type="text"
                sx={{
                  backgroundColor: "white",
                  borderRadius: "6px",
                  "& .MuiOutlinedInput-root": {
                    height: "45px",
                    fontSize: "12px",
                    borderColor: "black",
                  },
                }}
              />

              <Button
                className="main-btn"
                sx={{
                  color: "black",
                  backgroundColor: "white",
                  width: "100%",
                  height: "35px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                Continue with Phone
              </Button>
            </div>
          )}
          <Divider
            sx={{
              width: "26.5%",
              marginBottom: 30,
              borderColor: "#858585",
            }}
          />

          <Button
            className="google-btn"
            sx={{
              width: "100%",
              color: "white",
              backgroundColor: "#006bde",
              top: "10px",
              gap: "10px",
            }}
          >
            <Google sx={{ color: "white" }} /> Sign in with Google
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
