import React, { useEffect, useState } from "react";
import { Box, Chip, Typography } from "@mui/material";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

function formatCardDate(dateValue) {
  const d = dateValue ? new Date(dateValue) : null;
  if (!d || Number.isNaN(d.getTime())) return "";
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

function getGoogleMapsUrl({ location, locationUrl }) {
  if (locationUrl && typeof locationUrl === "string" && locationUrl.trim()) {
    return locationUrl.trim();
  }

  const q = encodeURIComponent(location || "");
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

function SmallEventCard({ event, onClick }) {
  const status = event?.participationStatus;
  const showStatus = status === "approved" || status === "rejected";
  const dateLabel = formatCardDate(event?.startDate);
  const mapsHref = getGoogleMapsUrl({
    location: event?.location || "",
    locationUrl: event?.locationUrl || "",
  });

  return (
    <Box
      onClick={onClick}
      sx={{
        cursor: "pointer",
        borderRadius: "18px",
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(20,20,20,0.92)",
        transition: "0.22s ease",
        boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
        "&:hover": { transform: "translateY(-3px)" },
      }}
    >
      <Box
        component="img"
        src={
          event.image ||
          "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format"
        }
        alt={event.title || "Event"}
        loading="lazy"
        sx={{
          width: "100%",
          height: 190,
          objectFit: "cover",
          display: "block",
          background: "#111",
        }}
      />

      <Box sx={{ p: 2.2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.9 }}>
          <Typography
            sx={{
              color: "white",
              fontWeight: 800,
              fontSize: "1.15rem",
              lineHeight: 1.25,
              flex: 1,
            }}
          >
            {event.title}
          </Typography>

          {showStatus && (
            <Chip
              size="small"
              label={status === "approved" ? "Approved" : "Rejected"}
              sx={{
                color: "white",
                fontWeight: 800,
                background:
                  status === "approved"
                    ? "rgba(34,197,94,0.18)"
                    : "rgba(239,68,68,0.18)",
                border: "1px solid rgba(255,255,255,0.18)",
              }}
            />
          )}
        </Box>

        <Typography sx={{ color: "rgba(255,255,255,0.65)", fontSize: "0.92rem" }}>
          {(event.category || "Category") + (dateLabel ? ` • ${dateLabel}` : "")}
        </Typography>

        <Typography
          component="a"
          href={mapsHref}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          sx={{
            display: "inline-block",
            mt: 1.1,
            color: "#60a5fa",
            fontSize: "0.95rem",
            textDecoration: "none",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          {event.location || "Location TBD"}
        </Typography>
      </Box>
    </Box>
  );
}

function CategoryEvents() {
  const { category } = useParams();
  const decodedCategory = decodeURIComponent(category);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const { token } = useAuth();
  const navigate = useNavigate();

  const fetchCategoryEvents = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `/api/v1/events/discover?category=${decodedCategory}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        setEvents(res.data.data || []);
      }
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryEvents();
  }, [decodedCategory]);

  return (
    <div style={{ padding: "30px" }}>
      <Typography variant="h4" sx={{ color: "white", mb: 3 }}>
        {decodedCategory} Events
      </Typography>

      {loading ? (
        <Typography sx={{ color: "white" }}>Loading events...</Typography>
      ) : events.length === 0 ? (
        <Typography sx={{ color: "gray" }}>
          No events found in {decodedCategory}.
        </Typography>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 360px))",
            gap: 18,
            justifyContent: "start",
          }}
        >
          {events.map((event) => (
            <SmallEventCard
              key={event._id}
              event={event}
              onClick={() => navigate(`/private/event/${event.slug}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryEvents;