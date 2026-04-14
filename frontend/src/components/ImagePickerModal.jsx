import React, { useState } from "react";
import { Box, Modal, TextField, Button, Typography } from "@mui/material";
import { fileToDataUrl } from "../utils/fileToDataUrl";

const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY || "";

function ImagePickerModal({ open, onClose, setSelectedTheme }) {
  const [search, setSearch] = useState("");

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

  const handleSearchImage = async () => {
    if (!search.trim()) return;
    if (!ACCESS_KEY) return;

    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${search}&client_id=${ACCESS_KEY}`
      );

      const data = await res.json();

      if (data.results?.length > 0) {
        const imgUrl = data.results[0].urls.regular;

        setSelectedTheme((prev) => ({
          ...prev,
          img: imgUrl,
        }));
      }

      onClose();
    } catch {
      onClose();
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
        <Typography variant="h6">Upload or Search Image</Typography>

        <input type="file" accept="image/*" onChange={handleUpload} />

        <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
          <TextField
            fullWidth
            label="Search image"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Button
            variant="contained"
            onClick={handleSearchImage}
            disabled={!ACCESS_KEY}
          >
            Search
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default ImagePickerModal;