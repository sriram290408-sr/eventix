import React from "react";
import { Box, Typography, Button, Drawer, Divider } from "@mui/material";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";

function ThemeSelector({
  themes,
  selectedTheme,
  setSelectedTheme,
  drawerOpen,
  setDrawerOpen,
}) {
  return (
    <>
      {/* Theme Box */}
      <Box
        sx={{
          mt: 3,
          width: 320,
          bgcolor: "rgba(0,0,0,0.55)",
          color: "white",
          p: 2,
          borderRadius: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backdropFilter: "blur(10px)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <img
            src={selectedTheme.theme}
            width={60}
            height={60}
            style={{ borderRadius: 10 }}
            alt="theme"
          />

          <Box>
            <Typography variant="body2">Theme</Typography>
            <Typography variant="h6">{selectedTheme.name}</Typography>
          </Box>
        </Box>

        <Button onClick={() => setDrawerOpen((prev) => !prev)}>
          {drawerOpen ? (
            <ArrowDropUp sx={{ color: "white", fontSize: "40px" }} />
          ) : (
            <ArrowDropDown sx={{ color: "white", fontSize: "40px" }} />
          )}
        </Button>
      </Box>

      {/* Drawer */}
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Divider
          sx={{
            border: "grey solid 2px",
            maxWidth: "75px",
            height: "5px",
            margin: "10px auto",
            borderRadius: "20px",
            backgroundColor: "#8c8c8c",
          }}
        />

        <Box
          sx={{
            p: 4,
            display: "flex",
            gap: 3,
            overflowX: "auto",
          }}
        >
          {themes.map((theme) => (
            <Box
              key={theme.name}
              onClick={() => {
                setSelectedTheme(theme);
                setDrawerOpen(false);
              }}
              sx={{
                minWidth: 140,
                bgcolor: "grey.900",
                color: "white",
                p: 2,
                borderRadius: 4,
                cursor: "pointer",
                textAlign: "center",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              <img
                src={theme.theme}
                width={110}
                height={80}
                style={{ borderRadius: 10, objectFit: "cover" }}
                alt="theme"
              />
              <Typography mt={1} variant="body2">
                {theme.name}
              </Typography>
            </Box>
          ))}
        </Box>
      </Drawer>
    </>
  );
}

export default ThemeSelector;