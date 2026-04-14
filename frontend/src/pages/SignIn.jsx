import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Typography,
  TextField,
  CircularProgress,
  Box,
} from "@mui/material";
import { ExitToAppRounded } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

import "../styles/SignIn.css";

function SignIn() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      if (!formData.email || !formData.password) {
        setErrorMsg("Email and password are required.");
        setLoading(false);
        return;
      }

      const res = await axios.post("/api/v1/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      console.log("LOGIN RESPONSE:", res.data);

      // ✅ NEW FORMAT (responseHandler format)
      if (res.data?.success && res.data?.data?.token && res.data?.data?.user) {
        login(res.data.data.user, res.data.data.token);
        navigate("/private/event", { replace: true });
        return;
      }

      // ✅ OLD FORMAT fallback
      if (res.data?.token && res.data?.user) {
        login(res.data.user, res.data.token);
        navigate("/private/event", { replace: true });
        return;
      }

      setErrorMsg("Invalid response from server. Please try again.");
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message ||
          err.message ||
          "Authentication failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-card">
        <Button
          component={Link}
          to="/"
          sx={{
            display: "flex",
            justifyContent: "start",
            width: "fit-content",
          }}
        >
          <ExitToAppRounded className="icon-box" />
        </Button>

        <Typography
          variant="h5"
          className="title"
          sx={{ textAlign: "center", marginBottom: 2 }}
        >
          Welcome to Eventix
        </Typography>

        <Typography
          className="subtitle"
          sx={{ textAlign: "center", marginBottom: 3 }}
        >
          Sign in to continue.
        </Typography>

        {errorMsg && (
          <Typography
            sx={{
              color: "red",
              fontSize: "14px",
              marginBottom: "15px",
              textAlign: "center",
            }}
          >
            {errorMsg}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              placeholder="Email *"
              name="email"
              type="email"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              sx={{ backgroundColor: "white", borderRadius: "6px" }}
              required
            />

            <TextField
              placeholder="Password *"
              name="password"
              type="password"
              fullWidth
              value={formData.password}
              onChange={handleChange}
              sx={{ backgroundColor: "white", borderRadius: "6px" }}
              required
            />

            <Button
              type="submit"
              disabled={loading}
              variant="contained"
              sx={{
                backgroundColor: "#006bde",
                width: "100%",
                height: "40px",
                marginTop: 2,
                "&:hover": { backgroundColor: "#0056b3" },
              }}
            >
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Sign In"
              )}
            </Button>
          </Box>
        </form>

        <Typography
          component={Link}
          to="/signup"
          sx={{
            display: "block",
            textAlign: "center",
            marginTop: 3,
            cursor: "pointer",
            color: "#006bde",
            textDecoration: "none",
            fontSize: "14px",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          Don't have an account? Sign Up
        </Typography>
      </div>
    </div>
  );
}

export default SignIn;