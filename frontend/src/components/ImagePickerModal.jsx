import React, { useState } from "react";
import { Box, Modal, TextField, Button, Typography } from "@mui/material";
import { fileToDataUrl } from "../utils/fileToDataUrl";

const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

function ImagePickerModal({ open, onClose, setSelectedTheme }) {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Upload Image
  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imgUrl = await fileToDataUrl(file);

    setSelectedTheme((prev) => ({
      ...prev,
      img: imgUrl,
    }));

    onClose();
  };

  // Search Image from Unsplash
  const handleSearchImage = async () => {
    if (!search.trim()) return;

    if (!ACCESS_KEY) {
      alert("Unsplash Access Key missing in .env");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`https://api.unsplash.com/search/photos?query=${search}&per_page=5`, {
        headers: {
          Authorization: `Client-ID ${ACCESS_KEY}`,
        },
      });

      const data = await res.json();

      if (data.results && data.results.length > 0) {
        const imgUrl = data.results[0].urls.regular;

        setSelectedTheme((prev) => ({
          ...prev,
          img: imgUrl,
        }));

        onClose();
      } else {
        alert("No images found");
      }
    } catch (error) {
      console.log("Unsplash Error:", error);
      alert("Failed to fetch images from Unsplash");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 420,
          bgcolor: "white",
          margin: "120px auto",
          p: 3,
          borderRadius: 3,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Upload or Search Image
        </Typography>

        {/* Upload */}
        <input type="file" accept="image/*" onChange={handleUpload} />

        {/* Search */}
        <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
          <TextField
            fullWidth
            label="Search image"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Button variant="contained" onClick={handleSearchImage} disabled={loading}>
            {loading ? "..." : "Search"}
          </Button>
        </Box>

        {!ACCESS_KEY && (
          <Typography sx={{ mt: 2, color: "red", fontSize: "13px" }}>
            Unsplash Key not found. Add VITE_UNSPLASH_ACCESS_KEY in .env
          </Typography>
        )}
      </Box>
    </Modal>
  );
}

export default ImagePickerModal;
