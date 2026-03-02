import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Navbar from "../components/Navbar";
import { ToggleButtonGroup, ToggleButton } from "@mui/material";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import "../styles/Event.css";

function Event() {
  const [view, setView] = useState("upcoming");

  const handleChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  return (
    <div>
      <Navbar />

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
          <div className="empty-state" style={{margin: "100px"}}>
            <EventNoteOutlinedIcon className="empty-icon"  />

            <Typography variant="h6" className="empty-title">
              No Upcoming Events
            </Typography>

            <Typography className="empty-sub">
              You have no upcoming events. Why not host one?
            </Typography>

            <button className="create-btn">+ Create Event</button>
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
