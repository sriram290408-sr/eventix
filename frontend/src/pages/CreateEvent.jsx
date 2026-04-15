import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  Menu,
  MenuItem,
  Modal,
} from "@mui/material";

import {
  Image,
  ArrowDropDown,
  ArrowForwardIos,
  Public,
  AutoAwesome,
  LocalActivity,
} from "@mui/icons-material";

import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import themes from "../context/Theme";
import LocationSearch from "../components/LocationSearch";
import ThemeSelector from "../components/ThemeSelector";
import ImagePickerModal from "../components/ImagePickerModal";
import TiptapEditor from "../components/TiptapEditor";

import useCreateEventForm from "../Hooks/useCreateEvent";

function CreateEvent() {
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();

  const {
    openImageModal,
    setOpenImageModal,
    drawerOpen,
    setDrawerOpen,
    selectedTheme,
    setSelectedTheme,
    anchorEl,
    setAnchorEl,
    openMenu,
    pricingModal,
    setPricingModal,
    authModal,
    setAuthModal,

    visibility,
    setVisibility,
    location,
    setLocation,
    category,
    setCategory,
    eventName,
    setEventName,
    startDate,
    setStartDate,
    endDate,
    setEndDate,

    loading,
    setLoading,
    errors,
    validateForm,
  } = useCreateEventForm();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Type your event description...",
      }),
    ],
    content: "",
  });

  const handleCreateEvent = async () => {
    if (!isAuthenticated) {
      setAuthModal(true);
      return;
    }

    const isValid = await validateForm();
    if (!isValid) return;

    try {
      setLoading(true);

      const eventData = {
        title: eventName,
        description: editor?.getHTML() || "",
        category,
        startDate,
        endDate,
        location,
        visibility,
        requireApproval: false,
        ticketPrice: 0,
        image: selectedTheme?.img || "",
        theme: selectedTheme || null,
      };

      const BASE_URL = import.meta.env.BACKEND_URL || "";

      const res = await fetch(`${BASE_URL}/api/v1/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });

      const data = await res.json();

      if (data.success) {
        alert("Event Created Successfully!");
        navigate(`/private/event/${data.data.slug}`);
      } else {
        alert(data.message || "Event creation failed");
      }
    } catch (err) {
      console.error("Create event error:", err);
      alert("Something went wrong while creating event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: selectedTheme.font, minHeight: "100vh" }}>
      {selectedTheme.video && (
        <video
          key={selectedTheme.video}
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "fixed",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            top: 0,
            left: 0,
            zIndex: -2,
          }}
        >
          <source src={selectedTheme.video} type="video/mp4" />
        </video>
      )}

      <div
        style={{
          position: "fixed",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          zIndex: -1,
          pointerEvents: "none",
          background: selectedTheme.video ? "rgba(0,0,0,0.65)" : selectedTheme.bg || "#0e0e0e",
        }}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 5,
          p: 4,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Box sx={{ position: "relative", width: 320 }}>
            <img
              src={selectedTheme.img}
              width="100%"
              height="320"
              alt="event"
              style={{ borderRadius: "16px", objectFit: "cover" }}
            />

            <Image
              onClick={() => setOpenImageModal(true)}
              sx={{
                position: "absolute",
                bottom: 12,
                right: 12,
                borderRadius: "50%",
                p: 1,
                cursor: "pointer",
                background: "rgba(0,0,0,0.4)",
                color: "white",
                "&:hover": { transform: "scale(1.1)" },
              }}
            />
          </Box>

          <ThemeSelector
            themes={themes}
            selectedTheme={selectedTheme}
            setSelectedTheme={setSelectedTheme}
            drawerOpen={drawerOpen}
            setDrawerOpen={setDrawerOpen}
          />
        </Box>

        <Box sx={{ width: "100%", maxWidth: "650px" }}>
          <FormControl
            sx={{
              width: "100%",
              borderRadius: "20px",
              overflowY: "auto",
              maxHeight: "85vh",
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
              p: 3,
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(255,255,255,0.3) transparent",
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
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "10px",
                  color: "white",
                  backgroundColor: "rgba(0,0,0,0.3)",
                  textTransform: "none",
                }}
              >
                {visibility === "Public" ? (
                  <Public sx={{ mr: 1 }} />
                ) : (
                  <AutoAwesome sx={{ mr: 1 }} />
                )}
                {visibility}
                <ArrowDropDown />
              </Button>
            </Box>

            <Menu anchorEl={anchorEl} open={openMenu} onClose={() => setAnchorEl(null)}>
              <MenuItem
                onClick={() => {
                  setVisibility("Public");
                  setAnchorEl(null);
                }}
              >
                <Public sx={{ mr: 3 }} /> Public
              </MenuItem>

              <MenuItem
                onClick={() => {
                  setVisibility("Private");
                  setAnchorEl(null);
                }}
              >
                <AutoAwesome sx={{ mr: 3 }} /> Private
              </MenuItem>
            </Menu>

            <TextField
              placeholder="Event Name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              fullWidth
              sx={{
                mt: 2,
                background: "rgba(255,255,255,0.12)",
                borderRadius: "12px",
                input: { color: "white", fontSize: "22px", fontWeight: 600 },
              }}
            />
            <Typography color="error">{errors.eventName}</Typography>

            <Box sx={{ display: "flex", gap: 2, mt: 3, flexWrap: "wrap" }}>
              <Box sx={{ flex: 1 }}>
                <Typography color="white" mb={1}>
                  Start Date
                </Typography>
                <TextField
                  type="date"
                  fullWidth
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  sx={{ background: "white", borderRadius: "10px" }}
                />
                <Typography color="error">{errors.startDate}</Typography>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography color="white" mb={1}>
                  End Date
                </Typography>
                <TextField
                  type="date"
                  fullWidth
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  sx={{ background: "white", borderRadius: "10px" }}
                />
                <Typography color="error">{errors.endDate}</Typography>
              </Box>
            </Box>

            <LocationSearch location={location} setLocation={setLocation} />
            <Typography color="error">{errors.location}</Typography>

            <Box mt={4}>
              <Typography variant="h6" color="white">
                Event Description
              </Typography>
              <TiptapEditor editor={editor} />
            </Box>

            <Box mt={4}>
              <Typography variant="h6" color="white" mb={1}>
                Event Category
              </Typography>

              <TextField
                select
                fullWidth
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                sx={{
                  background: "white",
                  borderRadius: "10px",
                }}
              >
                <MenuItem value="Tech">Tech</MenuItem>
                <MenuItem value="Food & Drink">Food & Drink</MenuItem>
                <MenuItem value="AI">AI</MenuItem>
                <MenuItem value="Arts & Culture">Arts & Culture</MenuItem>
                <MenuItem value="Climate">Climate</MenuItem>
                <MenuItem value="Fitness">Fitness</MenuItem>
                <MenuItem value="Wellness">Wellness</MenuItem>
                <MenuItem value="Crypto">Crypto</MenuItem>
              </TextField>

              <Typography color="error">{errors.category}</Typography>
            </Box>

            <Box mt={4}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 2,
                  borderRadius: "12px",
                  cursor: "pointer",
                  background: "rgba(255,255,255,0.06)",
                  "&:hover": { background: "rgba(255,255,255,0.1)" },
                }}
                onClick={() => setPricingModal(true)}
              >
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <LocalActivity sx={{ color: "white" }} />
                  <Typography color="white">Ticket Price</Typography>
                </Box>

                <Typography sx={{ color: "lightgray" }}>Free</Typography>

                <ArrowForwardIos sx={{ color: "lightgray", fontSize: 16 }} />
              </Box>
            </Box>

            <Box mt={4}>
              <Button
                fullWidth
                disabled={loading}
                variant="contained"
                sx={{
                  p: 1.4,
                  fontWeight: 700,
                  borderRadius: "14px",
                }}
                onClick={handleCreateEvent}
              >
                {loading ? "Creating..." : "Create Event"}
              </Button>
            </Box>
          </FormControl>
        </Box>
      </Box>

      <ImagePickerModal
        open={openImageModal}
        onClose={() => setOpenImageModal(false)}
        setSelectedTheme={setSelectedTheme}
      />

      <Modal open={pricingModal} onClose={() => setPricingModal(false)}>
        <Box
          sx={{
            width: 400,
            bgcolor: "#1e1e1e",
            color: "white",
            margin: "150px auto",
            p: 3,
            borderRadius: 4,
            textAlign: "center",
          }}
        >
          <LocalActivity sx={{ fontSize: 50, mb: 1 }} />

          <Typography variant="h5" mb={1}>
            Ticket Pricing
          </Typography>

          <Typography
            sx={{
              color: "rgba(255,255,255,0.75)",
              fontSize: "0.92rem",
              mb: 1,
            }}
          >
            Payments can be enabled through Stripe integration.
          </Typography>

          <Typography
            sx={{
              color: "rgba(255,255,255,0.7)",
              fontSize: "0.84rem",
              mb: 1.4,
            }}
          >
            Right now, event ticket is set to Free by default.
          </Typography>

          <Button
            fullWidth
            variant="outlined"
            sx={{
              mt: 2,
              color: "white",
              borderColor: "rgba(255,255,255,0.4)",
            }}
            onClick={() => window.open("https://stripe.com/in/pricing", "_blank")}
          >
            Connect Stripe
          </Button>
        </Box>
      </Modal>

      <Modal open={authModal} onClose={() => setAuthModal(false)}>
        <Box
          sx={{
            width: 350,
            bgcolor: "white",
            p: 3,
            borderRadius: 3,
            margin: "180px auto",
            textAlign: "center",
          }}
        >
          <Typography variant="h6" mb={2}>
            You need to sign in
          </Typography>

          <Button fullWidth variant="contained" onClick={() => navigate("/signin")}>
            Go to Sign In
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default CreateEvent;
