import React from "react";
import { Box } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import "../styles/Calendar.css";

function Calendar() {
  return (
    <Box className="container">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar className="calendar" />
      </LocalizationProvider>
    </Box>
  );
}

export default Calendar;
