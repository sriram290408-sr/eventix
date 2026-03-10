import React from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Box,
  Container,
  Typography,
  Stack,
  IconButton,
} from "@mui/material";
import { Instagram, X, Email } from "@mui/icons-material";
import "../styles/Footer.css";

function Footer() {
  return (
    <Box
      className="footer-box"
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container>
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: "center",
          }}
        >
          <Box className="footer-left">
            <Typography
              sx={{ fontSize: "22px", display: "flex", color: "white" }}
              variant="h6"
            >
              ✦
            </Typography>

            <Button
              component={Link}
              to="/discover"
              sx={{ fontSize: "12px", color: "#a3a3a3" }}
            >
              Discover
            </Button>
            <Button
              component={Link}
              sx={{ fontSize: "12px", color: "#a3a3a3" }}
            >
              Help
            </Button>
          </Box>
          <Typography
            variant="caption"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textDecoration: "none",
              fontSize: "12px",
            }}
            id="host"
            component={Link}
            to={"/private/create-event"}
          >
            Host your event with Eventix ↗
          </Typography>
          <Box className="footer-right">
            <IconButton component={Link} to={"https://www.instagram.com"}>
              <Instagram sx={{ fontSize: "18px", color: "#a3a3a3" }} />
            </IconButton>
            <IconButton component={Link} to={"https://x.com"}>
              <X sx={{ fontSize: "18px", color: "#a3a3a3" }} />
            </IconButton>
            <IconButton component={Link} to={"https://mail.google.com/mail/u/0/#inbox?compose=new"}>
              <Email sx={{ fontSize: "19px", color: "#a3a3a3" }} />
            </IconButton>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

export default Footer;
