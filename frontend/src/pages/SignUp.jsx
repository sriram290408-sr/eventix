import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Typography, TextField, CircularProgress, Box } from "@mui/material";
import { ExitToAppRounded } from "@mui/icons-material";
import axios from "axios";

import "../styles/SignIn.css";

function SignUp() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      if (!formData.firstName || !formData.email || !formData.password) {
        setErrorMsg("First name, email and password are required.");
        setLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        setErrorMsg("Password must be at least 6 characters.");
        setLoading(false);
        return;
      }

      const BASE_URL = import.meta.env.VITE_BACKEND_URL || "";

      const res = await axios.post(
        `${BASE_URL}/api/v1/auth/register`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        },
        { withCredentials: true },
      );

      if (res.data?.success) {
        setSuccessMsg("Account created successfully. Redirecting to login...");
        setTimeout(() => navigate("/signin", { replace: true }), 1200);
      } else {
        setErrorMsg(res.data?.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.log("REGISTER ERROR:", err);

      setErrorMsg(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Registration failed. Please try again.",
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

        <Typography variant="h5" className="title" sx={{ textAlign: "center", marginBottom: 2 }}>
          Welcome to Eventix
        </Typography>

        <Typography className="subtitle" sx={{ textAlign: "center", marginBottom: 3 }}>
          Create an account to get started.
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

        {successMsg && (
          <Typography
            sx={{
              color: "green",
              fontSize: "14px",
              marginBottom: "15px",
              textAlign: "center",
            }}
          >
            {successMsg}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              placeholder="First Name *"
              name="firstName"
              fullWidth
              value={formData.firstName}
              onChange={handleChange}
              sx={{ backgroundColor: "white", borderRadius: "6px" }}
              required
            />

            <TextField
              placeholder="Last Name"
              name="lastName"
              fullWidth
              value={formData.lastName}
              onChange={handleChange}
              sx={{ backgroundColor: "white", borderRadius: "6px" }}
            />

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
              {loading ? <CircularProgress size={20} color="inherit" /> : "Sign Up"}
            </Button>
          </Box>
        </form>

        <Typography
          component={Link}
          to="/signin"
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
          Already have an account? Sign In
        </Typography>
      </div>
    </div>
  );
}

export default SignUp;
