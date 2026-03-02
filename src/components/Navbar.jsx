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

import { Search, Ticket, Compass, CalendarDays } from "lucide-react";
import Clock from "./Clock";
import { Link } from "react-router-dom";

function Navbar() {

  const [Menuanchor, setMenuanchor] = useState(null);

  const open = Boolean(Menuanchor);

  const handleAvatarClick = (event) => {
    setMenuanchor(event.currentTarget);
  };

  const handleClose = () => {
    setMenuanchor(null);
  };

  return (
    <AppBar position="static" id="app">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>

        <Typography sx={{ fontSize: "35px" }}>✦</Typography>

        <Stack
          direction="row"
          spacing={2}
          sx={{ flexGrow: 1, justifyContent: "center" }}
        >
          <Button color="inherit" startIcon={<Ticket size={18} />}>
            Events
          </Button>

          <Button color="inherit" startIcon={<CalendarDays size={18} />}>
            Calendars
          </Button>

          <Button color="inherit" startIcon={<Compass size={18} />}>
            Discover
          </Button>
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center">

          <Clock />

          <Button color="inherit">
            Create Event
          </Button>

          <IconButton>
            <Search size={20} />
          </IconButton>

          {/* Avatar */}
          <Avatar
            sx={{ width: 30, height: 30, cursor: "pointer" }}
            onClick={handleAvatarClick}
          />

          {/* Menu */}
          <Menu
            anchorEl={Menuanchor}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>
              <Avatar sx={{ width: 32, height: 32, marginRight: 1 }} />
              <div>
                <Typography>UserName</Typography>
                <Typography variant="body2">
                  username123@gmail.com
                </Typography>
              </div>
            </MenuItem>

            <Divider />

            <MenuItem onClick={handleClose}>View Profile</MenuItem>
            <MenuItem onClick={handleClose}>Settings</MenuItem>
            <MenuItem onClick={handleClose}>Sign Out</MenuItem>
          </Menu>

        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;