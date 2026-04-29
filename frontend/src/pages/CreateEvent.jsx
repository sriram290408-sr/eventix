import { useState } from "react";
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
  Clear,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import themes from "../context/Theme";
import LocationSearch from "../components/LocationSearch";
import ThemeSelector from "../components/ThemeSelector";
import ImagePickerModal from "../components/ImagePickerModal";

import useCreateEventForm from "../Hooks/useCreateEvent";

function CreateEvent() {
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();

  const [description, setDescription] = useState("");

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
        description,
        category,
        startDate,
        endDate,
        location,
        visibility,
        requireApproval: true,
        ticketPrice: 0,
        image: selectedTheme?.img || "",
        theme: selectedTheme || null,
      };

      const BASE_URL = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/$/, "");

      const res = await fetch(`${BASE_URL}/api/v1/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert("Event Created Successfully!");
        navigate(`/private/event/${data.data.slug}`);
      } else {
        alert(data.message || "Event creation failed");
      }
    } catch (err) {
      console.error("Create event error:", err);
      alert("Server not responding or CORS issue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {selectedTheme.video && (
        <video
          className="fixed top-0 left-0 w-full h-full object-cover -z-[2]"
          key={selectedTheme.video}
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={selectedTheme.video} type="video/mp4" />
        </video>
      )}

      <div
        className="fixed inset-0 w-full h-full top-0 left-0 -z-[1] pointer-events-none"
        style={{
          background: selectedTheme.video ? "rgba(0,0,0,0.65)" : selectedTheme.bg || "#0e0e0e",
        }}
      />

      <Box className="flex justify-center gap-5 p-4 flex-wrap">
        <Box>
          <Box className="relative w-80">
            <img
              src={selectedTheme.img}
              alt="event"
              className="w-full h-80 rounded-2xl object-cover"
            />

            <Image
              onClick={() => setOpenImageModal(true)}
              sx={{ color: "white", fontSize: "50px" }}
              className="absolute bottom-3 right-3 rounded-full p-3 cursor-pointer bg-black/40 hover:scale-110 transition-transform"
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

        <Box className="w-full max-w-[650px]">
          <FormControl
            className="overflow-y-auto no-scrollbar 
            w-full border-[20px] 
            max-h-[85vh] bg-[rgba(255, 255, 255, 0.08)] 
            backdrop-blur-[12px] rounded-2xl 
            shadow-[0_8px_32px rgb(159, 159, 159)]"
            sx={{ padding: 2, border: "1px solid grey" }}
          >
            <Box className="flex justify-end">
              <Button
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{
                  border: "1px solid grey",
                  borderRadius: "10px",
                  color: "white",
                  textTransform: "none",
                }}
              >
                {visibility === "Public" ? (
                  <Public className="mr-[7px]" />
                ) : (
                  <AutoAwesome className="mr-[7px]" />
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
                <Public className="mr-2" /> Public
              </MenuItem>

              <MenuItem
                onClick={() => {
                  setVisibility("Private");
                  setAnchorEl(null);
                }}
              >
                <AutoAwesome className="mr-2" /> Private
              </MenuItem>
            </Menu>

            <TextField
              placeholder="Event Name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="w-full bg-[rgba(255,255,255,0.12)] rounded-sm"
              sx={{
                mt: 2,
                input: { color: "white", fontSize: "22px", fontWeight: 600 },
              }}
            />
            <Typography color="error">{errors.eventName}</Typography>

            <Box className="flex mt-3 gap-2 flex-wrap " sx={{ mt: 3 }}>
              <Box className="flex-1">
                <Typography className="text-white mb-2">Start Date</Typography>
                <TextField
                  type="date"
                  fullWidth
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-white rounded-[10px]"
                />
                <Typography color="error">{errors.startDate}</Typography>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography className="text-white mb-2">End Date</Typography>
                <TextField
                  type="date"
                  fullWidth
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-white rounded-[10px]"
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

              <TextField
                multiline
                rows={5}
                fullWidth
                placeholder="Write event description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-2 bg-[rgba(255,255,255,0.12)] rounded-[12px] " 
                sx={{
                  textarea: { color: "white" },
                }}
              />
            </Box>

            <Box className="mt-4">
              <Typography variant="h6" color="white" mb={1}>
                Event Category
              </Typography>

              <TextField
                select
                fullWidth
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                SelectProps={{ displayEmpty: true }}
                sx={{
                  background: "white",
                  borderRadius: "10px",
                }}
              >
                <MenuItem value="" disabled>
                  Select Category
                </MenuItem>

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

                <Typography sx={{ color: "white", marginLeft: "70%" }}>Free</Typography>

                <ArrowForwardIos sx={{ color: "white", fontSize: 16 }} />
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
          <Box className="relative">
            <Clear
              onClick={() => setPricingModal(false)}
              sx={{ fontSize: "30px" }}
              className="absolute top-1 right-1 text-white cursor-pointer hover:scale-110 transition-transform"
            />
            <LocalActivity sx={{ fontSize: "60px" }} className=" mb-2 text-white" />
          </Box>

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
