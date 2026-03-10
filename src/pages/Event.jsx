import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import {
  ToggleButtonGroup,
  ToggleButton,
  Divider,
  Button,
} from "@mui/material";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import "../styles/Event.css";

function Event() {
  const [view, setView] = useState("upcoming");

  const handleChange = (_, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  return (
    <div>
      <div className="top">
        <div className="event-header">
          <Typography variant="h4" className="event-title">
            Events
          </Typography>

          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleChange}
            className="button-switch"
          >
            <ToggleButton value="upcoming">Upcoming</ToggleButton>
            <ToggleButton value="past">Past</ToggleButton>
          </ToggleButtonGroup>
        </div>
      </div>

      <div className="event-body">
        {view === "upcoming" && (
          <div
            className="empty-state"
            style={{
              margin: "100px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <EventNoteOutlinedIcon className="empty-icon" />

            <Typography
              variant="h6"
              className="empty-title"
              sx={{ fontSize: "22px" }}
            >
              No Upcoming Events
            </Typography>

            <Typography className="empty-sub" sx={{ fontSize: "14px" }}>
              You have no upcoming events. Why not host one?
            </Typography>

            <Button
              className="create-btn"
              component={Link}
              to={"/private/create-event"}
              sx={{
                color: "white",
                fontWeight: "500",
                backgroundColor: "#007bff",
                borderColor: "white",
              }}
            >
              + Create Event
            </Button>
          </div>
        )}

        {view === "past" && (
          <div className="past-events">
            <div className="event-card">
              <div className="event-date">
                <Typography>21 Feb</Typography>
                <span>Saturday</span>
              </div>

              <div className="event-details">
                <Typography className="event-time">1:30 pm</Typography>
                <Typography className="event-name">
                  Chennai React Meetup #16
                </Typography>
                <Typography className="event-place">
                  Comcast India Engineering Center LLP
                </Typography>
                <span className="going-badge">Going</span>
              </div>
            </div>

            <div className="event-card">
              <div className="event-date">
                <Typography>6 Dec 2025</Typography>
                <span>Saturday</span>
              </div>

              <div className="event-details">
                <Typography className="event-time">2:00 pm</Typography>
                <Typography className="event-name">
                  JSLovers Chennai Meetup #8
                </Typography>
                <Typography className="event-place">
                  Tekclan Software Solutions Pvt Ltd
                </Typography>
                <span className="going-badge">Going</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Event;
