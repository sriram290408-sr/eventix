import React from "react";
import { Chip, Typography } from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";

import "../styles/EventCard.css";

function EventCard({ event, onClick }) {
  const handleCopy = (e) => {
    e.stopPropagation();

    const url = `${window.location.origin}/private/event/${event.slug}`;
    navigator.clipboard.writeText(url);

    alert("Event link copied!");
  };

  return (
    <div className="event-card-discover" onClick={onClick}>
      {/* Image */}
      <div className="card-img-wrapper">
        <img
          src={
            event.image ||
            "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format"
          }
          alt={event.title}
          className="card-img"
        />

        <div className="card-img-overlay" />

        {/* Category */}
        <Chip
          label={event.category}
          size="small"
          className="card-category-badge"
        />

        {/* Price */}
        <div className="card-price-badge">
          {event.ticketPrice > 0 ? `₹${event.ticketPrice}` : "Free"}
        </div>

        {/* Copy Button */}
        <button className="copy-btn" onClick={handleCopy}>
          <ContentCopyOutlinedIcon sx={{ fontSize: "16px" }} />
          Copy Link
        </button>
      </div>

      {/* Body */}
      <div className="card-body">
        <Typography className="card-event-title">{event.title}</Typography>

        <div className="card-meta">
          <div className="card-meta-row">
            <CalendarTodayOutlinedIcon className="meta-icon" />
            <span>
              {new Date(event.startDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="card-meta-row">
            <LocationOnOutlinedIcon className="meta-icon" />
            <span>{event.location || "Online"}</span>
          </div>

          <div className="card-meta-row">
            <PeopleAltOutlinedIcon className="meta-icon" />
            <span>
              By{" "}
              <strong>
                {event.creator?.username ||
                  event.creator?.firstName ||
                  "Unknown"}
              </strong>
            </span>
          </div>
        </div>

        <div className="card-footer">
          <div
            className={`approval-badge ${
              event.requireApproval ? "approval-required" : "open-badge"
            }`}
          >
            {event.requireApproval ? "Approval Required" : "Open to Join"}
          </div>

          <button className="view-btn">View →</button>
        </div>
      </div>
    </div>
  );
}

export default EventCard;