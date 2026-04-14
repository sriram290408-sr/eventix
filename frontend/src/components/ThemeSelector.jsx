import { Box, Typography, Button, Drawer } from "@mui/material";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";

function ThemeSelector({ themes, selectedTheme, setSelectedTheme, drawerOpen, setDrawerOpen }) {
  return (
    <div>
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
            style={{ borderRadius: 10, objectFit: "cover" }}
            alt="theme"
          />

          <Box>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Theme
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {selectedTheme.name}
            </Typography>
          </Box>
        </Box>

        <Button onClick={() => setDrawerOpen((prev) => !prev)} sx={{ minWidth: "auto", p: 0 }}>
          {drawerOpen ? (
            <ArrowDropUp sx={{ color: "white", fontSize: "40px" }} />
          ) : (
            <ArrowDropDown sx={{ color: "white", fontSize: "40px" }} />
          )}
        </Button>
      </Box>

      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: "#0f0f0f",
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
            pb: 4,
          },
        }}
      >
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            display: "flex",
            justifyContent: "center",
            background: "#0f0f0f",
            pt: 1.2,
            pb: 2,
          }}
        >
          <Box
            sx={{
              px: 4,
              pb: 4,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 3,
              flexWrap: "wrap",
              overflowY: "auto",
              maxHeight: "55vh",
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(255,255,255,0.25) transparent",
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                background: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "rgba(255,255,255,0.25)",
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: "rgba(255,255,255,0.4)",
              },
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
                  width: 160,
                  bgcolor:
                    selectedTheme.name === theme.name
                      ? "rgba(255,255,255,0.12)"
                      : "rgba(255,255,255,0.06)",
                  border:
                    selectedTheme.name === theme.name
                      ? "1px solid rgba(255,255,255,0.35)"
                      : "1px solid rgba(255,255,255,0.12)",
                  color: "white",
                  marginTop: 2,
                  p: 2,
                  borderRadius: 4,
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "0.2s",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  "&:hover": {
                    transform: "scale(1.05)",
                    borderColor: "rgba(255,255,255,0.35)",
                  },
                }}
              >
                <img
                  src={theme.theme}
                  width={120}
                  height={90}
                  style={{ borderRadius: 10, objectFit: "cover" }}
                  alt="theme"
                />

                <Typography mt={1} variant="body2" sx={{ fontWeight: 600 }}>
                  {theme.name}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Drawer>
    </div>
  );
}

export default ThemeSelector;
