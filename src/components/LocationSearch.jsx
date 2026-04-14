import React, { useRef, useState } from "react";
import { Box, TextField, Typography } from "@mui/material";

function LocationSearch({ location, setLocation }) {
  const [suggestions, setSuggestions] = useState([]);
  const debounceRef = useRef(null);

  const handleSearch = (value) => {
    setLocation(value);

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(
          value
        )}`;

        const res = await fetch(`https://corsproxy.io/?${url}`);
        const data = await res.json();

        setSuggestions(data || []);
      } catch {
        setSuggestions([]);
      }
    }, 500);
  };

  const handleSelectLocation = (place) => {
    const name = place.display_name;

    setLocation(name);
    setSuggestions([]);
  };

  return (
    <Box mt={4}>
      <Typography variant="h6" color="white">
        Add Event Location
      </Typography>

      <Typography variant="body2" color="gray">
        Search a place
      </Typography>

      <TextField
        fullWidth
        placeholder="Search location"
        value={location}
        sx={{
          background: "white",
          borderRadius: "10px",
          mt: 2,
        }}
        onChange={(e) => handleSearch(e.target.value)}
      />

      {suggestions.length > 0 && (
        <Box
          sx={{
            mt: 1,
            background: "white",
            borderRadius: "10px",
            maxHeight: "180px",
            overflowY: "auto",
          }}
        >
          {suggestions.map((place, index) => (
            <Box
              key={index}
              onClick={() => handleSelectLocation(place)}
              sx={{
                p: 1,
                background: "#fff",
                color: "black",
                cursor: "pointer",
                borderBottom: "1px solid #ddd",
                "&:hover": { background: "#000", color: "white" },
              }}
            >
              {place.display_name}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default LocationSearch;