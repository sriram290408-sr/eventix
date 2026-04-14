import React, { useState } from "react";
import "../styles/Navbar.css";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Stack,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";

import { Ticket, Compass } from "lucide-react";
import Clock from "./Clock";
import { Link, useNavigate } from "react-router-dom";
import { LocalActivity } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const open = Boolean(menuAnchor);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleAvatarClick = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <AppBar position="sticky" color="transparent" elevation={0}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography sx={{ fontSize: "35px" }}>✦</Typography>

        <Stack
          direction="row"
          spacing={2}
          sx={{ flexGrow: 1, justifyContent: "center" }}
        >
          <Button
            component={Link}
            to="/private/event"
            color="inherit"
            startIcon={<Ticket size={18} />}
          >
            Events
          </Button>

          <Button
            component={Link}
            to="/private/my-event"
            color="inherit"
            startIcon={<LocalActivity />}
          >
            My events
          </Button>

          <Button
            component={Link}
            to="/private/discover"
            color="inherit"
            startIcon={<Compass size={18} />}
          >
            Discover
          </Button>
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center">
          <Clock />

          <Button component={Link} to="/private/create-event" color="inherit">
            Create Event
          </Button> 

          <Avatar
            sx={{ width: 30, height: 30, cursor: "pointer" }}
            src={user?.avatar || ""}
            onClick={handleAvatarClick}
          />

          <Menu anchorEl={menuAnchor} open={open} onClose={handleClose}>
            <MenuItem>
              <Avatar
                sx={{ width: 32, height: 32, mr: 1 }}
                src={user?.avatar || ""}
              />

              <div>
                <Typography sx={{ fontWeight: 600 }}>
                  {user?.username || "User"}
                </Typography>

                <Typography variant="body2" sx={{ color: "gray" }}>
                  {user?.email || ""}
                </Typography>
              </div>
            </MenuItem>

            <Divider />

            <MenuItem component={Link} to="/private/event">
              Home
            </MenuItem>

            <MenuItem component={Link} to="/private/profile">
              Profile
            </MenuItem>

            <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
          </Menu>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
