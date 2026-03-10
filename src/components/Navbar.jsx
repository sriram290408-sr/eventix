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
  const [menuAnchor, setMenuAnchor] = useState(null);
  const open = Boolean(menuAnchor);

  const handleAvatarClick = (event) => {
    setMenuAnchor(event.target);
  };

  const handleClose = () => {
    setMenuAnchor(null);
  };

  return (
    <AppBar position="sticky" id="app" color="transparent" elevation={0}>
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
            to="/private/calendar"
            color="inherit"
            startIcon={<CalendarDays size={18} />}
          >
            Calendars
          </Button>

          <Button
            component={Link}
            to="/discover"
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

          <IconButton>
            <Search size={20} />
          </IconButton>

          <Avatar
            sx={{ width: 30, height: 30, cursor: "pointer" }}
            onClick={handleAvatarClick}
          />

          <Menu anchorEl={menuAnchor} open={open} onClose={handleClose}>
            <MenuItem onClick={handleClose}>
              <Avatar sx={{ width: 32, height: 32, mr: 1 }} />
              <div>
                <Typography>UserName</Typography>
                <Typography variant="body2">username123@gmail.com</Typography>
              </div>
            </MenuItem>

            <Divider />

            <MenuItem onClick={handleClose} component={Link} to={"/private/event"}>
              Home
            </MenuItem>
            <MenuItem onClick={handleClose}>View Profile</MenuItem>
            <MenuItem onClick={handleClose} component={Link} to={"/"}>
              Sign Out
            </MenuItem>
          </Menu>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
