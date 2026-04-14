import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { Link, useNavigate } from "react-router-dom";
import { ToggleButtonGroup, ToggleButton, Button, Box, CircularProgress } from "@mui/material";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";

import "../styles/Event.css";

function AttendingSmallCard({ event, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        cursor: "pointer",
        borderRadius: 14,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(15,15,15,0.95)",
      }}
    >
      <img
        src={
          event.image ||
          "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format"
        }
        alt={event.title}
        style={{
          width: "100%",
          height: 150,
          objectFit: "cover",
          display: "block",
        }}
      />

      <div style={{ padding: 12 }}>
        <Typography
          sx={{
            color: "white",
            fontWeight: 700,
            fontSize: "1rem",
            mb: 0.8,
            lineHeight: 1.2,
          }}
        >
          {event.title}
        </Typography>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "rgba(255,255,255,0.72)",
            fontSize: "0.85rem",
            marginBottom: 6,
          }}
        >
          <CalendarTodayOutlinedIcon sx={{ fontSize: 15 }} />
          {event.startDate
            ? new Date(event.startDate).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "No Date"}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "#60a5fa",
            fontSize: "0.9rem",
          }}
        >
          <LocationOnOutlinedIcon sx={{ fontSize: 15 }} />
          <span>{event.location || "Location TBD"}</span>
        </div>
      </div>
    </div>
  );
}

function Event() {
  const [view, setView] = useState("upcoming");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { token } = useAuth();
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_BACKEND_URL || "";

  const handleChange = (_, newView) => {
    if (newView !== null) setView(newView);
  };

  // Fetch attending events
  const fetchAttendingEvents = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const res = await axios.get(`${BASE_URL}/api/v1/events/attending`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("ATTENDING RESPONSE:", res.data);

      if (res.data?.success) {
        setEvents(res.data.data || []);
      } else {
        setEvents(res.data || []);
      }
    } catch (err) {
      console.error("Attending Events Error:", err);

      if (err.response?.status === 401) {
        navigate("/signin", { replace: true });
        return;
      }

      setErrorMsg(err.response?.data?.message || "Failed to load attending events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/signin", { replace: true });
      return;
    }

    fetchAttendingEvents();
  }, [token]);

  // Filter upcoming/past
  const filteredEvents = events.filter((event) => {
    if (!event.startDate) return false;

    const eventDate = new Date(event.startDate);
    const now = new Date();

    return view === "upcoming" ? eventDate >= now : eventDate < now;
  });

  return (
    <div>
      <div style={{ padding: "22px 24px 0" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <Typography variant="h4" className="event-title" sx={{ mb: 0 }}>
            Attending Events
          </Typography>

          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleChange}
            size="small"
            sx={{
              background: "rgba(255,255,255,0.08)",
              borderRadius: "10px",
              "& .MuiToggleButton-root": {
                color: "rgba(255,255,255,0.75)",
                borderColor: "rgba(255,255,255,0.08)",
                px: 2,
              },
              "& .Mui-selected": {
                color: "white !important",
                background: "rgba(255,255,255,0.14) !important",
              },
            }}
          >
            <ToggleButton value="upcoming">Upcoming</ToggleButton>
            <ToggleButton value="past">Past</ToggleButton>
          </ToggleButtonGroup>
        </div>
      </div>

      <div className="event-body">
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
            <CircularProgress />
          </Box>
        ) : errorMsg ? (
          <Typography sx={{ textAlign: "center", color: "red", mt: 5 }}>{errorMsg}</Typography>
        ) : filteredEvents.length === 0 ? (
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

            <Typography variant="h6" sx={{ fontSize: "22px", color: "white" }}>
              No {view === "upcoming" ? "Upcoming" : "Past"} Events
            </Typography>

            <Typography sx={{ fontSize: "14px", color: "gray" }}>
              You have not joined any events yet.
            </Typography>

            <Button
              component={Link}
              to="/private/discover"
              sx={{
                color: "white",
                fontWeight: "500",
                backgroundColor: "#007bff",
                "&:hover": { backgroundColor: "#0056b3" },
              }}
            >
              Explore Events
            </Button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 260px))",
              gap: 14,
              padding: "0 24px 24px",
              justifyContent: "start",
            }}
          >
            {filteredEvents.map((event) => (
              <AttendingSmallCard
                key={event._id}
                event={event}
                onClick={() => navigate(`/private/event/${event.slug}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Event;
