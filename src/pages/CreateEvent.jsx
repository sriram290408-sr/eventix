import React from "react";
import { TextField, Button, Typography, FormLabel } from "@mui/material";
import "../styles/CreateEvent.css";

function CreateEvent() {
  return (
    <div className="create-event-page">
      <div className="image-section">
        <img src="/assets/card1.jpg" alt="event" className="event-image" />

        <Button variant="contained" className="upload-btn">
          Upload Image
        </Button>
      </div>

      <div className="form-section">
        <Typography variant="h4" className="event-title">
          Event Name
        </Typography>

        <div className="date-section">
          <div className="date-field">
            <FormLabel>Start Date</FormLabel>
            <TextField type="date" variant="outlined" size="small" />
          </div>

          <div className="date-field">
            <FormLabel>End Date</FormLabel>
            <TextField type="date" variant="outlined" size="small" />
          </div>
        </div>

        <div className="event-desc">
          <TextField
            label="Add Event Location"
            placeholder="Offline location or virtual link"
            variant="outlined"
            fullWidth
            size="small"
          />

          <TextField
            label="Add Description"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
          />
        </div>

        <div className="options-section">
          <Typography variant="h6" className="options-title">
            Event Options
          </Typography>

          <TextField
            label="Ticket Price"
            defaultValue="Free"
            variant="outlined"
            fullWidth
            size="small"
          />

          <TextField
            label="Capacity"
            defaultValue="Unlimited"
            variant="outlined"
            fullWidth
            size="small"
          />
        </div>

        <Button variant="contained" className="create-btn">
          Create Event
        </Button>
      </div>
    </div>
  );
}

export default CreateEvent;
