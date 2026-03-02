import React, { useState } from "react";
import Sign_nav from "../components/Sign_nav";
import {
  ExitToAppRounded,
  PhoneAndroidOutlined,
  MailLockOutlined,
  Google,
} from "@mui/icons-material";

import { Button, Typography, Divider, TextField } from "@mui/material";

import "../styles/SignIn.css";

function SignIn() {
  const [sign, setSign] = useState("mail");

  return (
    <div>
      <Sign_nav />

      <div className="signin-page">
        <div className="signin-card">
          <ExitToAppRounded className="icon-box" />

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
                type="string"
                sx={{
                  backgroundColor: "white",
                  borderRadius: "6px",
                  "& .MuiOutlinedInput-root": {
                    height: "45px",
                    width: "300px",
                    fontSize: "12px",
                  },
                }}
              />

              <Button
                className="main-btn"
                sx={{
                  color: "black",
                  backgroundColor: "white",
                  width: "360px",
                  height: "35px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 20,
                  marginLeft: 0,
                }}
              >
                Continue with Email
              </Button>

              <Divider className="divider">OR</Divider>

              <Button className="google-btn">
                <Google /> Sign in with Google
              </Button>
            </div>
          )}

          {sign === "phone" && (
            <div className="form-box">
              <div className="toggle-row">
                <Typography>Phone</Typography>

                <Typography className="switch" onClick={() => setSign("mail")}>
                  <MailLockOutlined fontSize="small" />
                  Use Email
                </Typography>
              </div>

              <TextField
                placeholder="+91 9876543210"
                fullWidth
                className="input"
                type="string"
                sx={{
                  backgroundColor: "white",
                  borderRadius: "6px",
                  "& .MuiOutlinedInput-root": {
                    height: "45px",
                    width: "300px",
                    fontSize: "12px",
                  },
                }}
              />

              <Button
                className="main-btn"
                sx={{
                  color: "black",
                  backgroundColor: "white",
                  width: "360px",
                  height: "35px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 20,
                  marginLeft: 0,
                }}
              >
                Continue with Phone
              </Button>

              <Divider className="divider">OR</Divider>

              <Button className="google-btn">
                <Google /> Sign in with Google
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SignIn;
