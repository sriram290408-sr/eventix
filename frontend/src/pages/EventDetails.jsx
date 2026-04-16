import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Snackbar,
  Stack,
  Typography,
  Chip,
} from "@mui/material";

import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

import { useAuth } from "../context/AuthContext";

function EventDetails() {
  const { slug } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const BASE_URL = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/$/, "");

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);

  const [joinLoading, setJoinLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [participationStatus, setParticipationStatus] = useState(null);

  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    message: "",
  });

  const showToast = (message) => {
    setToast({ open: true, message });
  };

  // Fetch Event
  const fetchEvent = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/api/v1/events/${slug}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setEvent(data.data);
        setParticipationStatus(null);
      } else {
        setEvent(null);
      }
    } catch (err) {
      console.log("Fetch Event Error:", err);
      setEvent(null);
    } finally {
      setLoading(false);
    }
  };

  // Join Event
  const handleJoin = async () => {
    try {
      if (!event?._id) return;

      setJoinLoading(true);

      const res = await fetch(`${BASE_URL}/api/v1/events/${event._id}/join`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        showToast(data.message || "Failed to join event");
        return;
      }

      const status = data.data?.status || "approved";
      setParticipationStatus(status);

      if (status === "pending") {
        showToast("Request sent for approval");
      } else {
        showToast("You joined the event!");
      }
    } catch (err) {
      console.log("Join Error:", err);
      showToast("Failed to join event");
    } finally {
      setJoinLoading(false);
    }
  };

  // Cancel Event
  const cancelEvent = async () => {
    try {
      if (!event?._id) return;

      setDeleteLoading(true);

      const res = await fetch(`${BASE_URL}/api/v1/events/${event._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        showToast(data.message || "Failed to cancel event");
        return;
      }

      showToast("Event cancelled");
      navigate("/private/my-event", { replace: true });
    } catch (err) {
      console.log("Cancel Event Error:", err);
      showToast("Failed to cancel event");
    } finally {
      setDeleteLoading(false);
      setConfirmCancelOpen(false);
    }
  };

  // Copy Link
  const copyLink = async () => {
    try {
      const url = `${window.location.origin}/private/event/${slug}`;
      await navigator.clipboard.writeText(url);
      showToast("Event link copied");
    } catch {
      showToast("Failed to copy link");
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const cleanDescription = (desc) => {
    if (!desc) return "";
    if (typeof desc === "string") {
      return desc.replace(/<\/?[^>]+(>|$)/g, "");
    }
    return JSON.stringify(desc);
  };

  const isCreator = event?.creator?._id === user?._id;

  const alreadyJoined = participationStatus === "approved";
  const pendingApproval = participationStatus === "pending";

  // Map URL
  const mapUrl = event?.locationUrl
    ? event.locationUrl
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        event?.location || "",
      )}`;

  useEffect(() => {
    if (!token) {
      navigate("/signin", { replace: true });
      return;
    }

    fetchEvent();
  }, [token, slug]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress sx={{ color: "#64a0fa" }} />
      </Box>
    );
  }

  if (!event) {
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <Typography variant="h5" color="white">
          Event not found
        </Typography>
      </Box>
    );
  }

  // Correctly handle theme
  const pageTheme = event.theme || {};
  const backgroundColor = pageTheme.bg || "#0e0e0e";
  const backgroundVideo = pageTheme.video || "";

  // Correctly handle hero image
  const heroImage =
    event.image ||
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&auto=format";

  return (
    <Box sx={{ minHeight: "100vh" }}>
      {/* Video Theme */}
      {backgroundVideo && (
        <video
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
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      )}

      {/* Background Overlay */}
      <div
        style={{
          position: "fixed",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          zIndex: -1,
          pointerEvents: "none",
          background: backgroundVideo ? "rgba(0,0,0,0.65)" : backgroundColor,
        }}
      />

      <Box sx={{ maxWidth: 980, mx: "auto", px: 2, py: 6 }}>
        <Card
          sx={{
            background: "rgba(0,0,0,0.45)",
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: "18px",
            overflow: "hidden",
            backdropFilter: "blur(10px)",
            boxShadow: "0 14px 48px rgba(0,0,0,0.35)",
          }}
        >
          {/* Banner */}
          <Box sx={{ position: "relative" }}>
            <Box
              component="img"
              src={heroImage}
              alt={event.title}
              sx={{
                width: "100%",
                height: { xs: 220, sm: 320 },
                objectFit: "cover",
              }}
            />

            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(180deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.80) 100%)",
              }}
            />
          </Box>

          <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
            <Stack spacing={2.2}>
              {/* Title */}
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 850,
                    color: "white",
                    fontSize: { xs: "2rem", sm: "2.4rem" },
                  }}
                >
                  {event.title}
                </Typography>

                {!isCreator && participationStatus && (
                  <Chip
                    label={
                      participationStatus === "approved"
                        ? "Approved"
                        : participationStatus === "pending"
                          ? "Pending"
                          : "Rejected"
                    }
                    sx={{
                      fontWeight: 800,
                      color: "white",
                      background:
                        participationStatus === "approved"
                          ? "rgba(34,197,94,0.25)"
                          : participationStatus === "pending"
                            ? "rgba(234,179,8,0.25)"
                            : "rgba(239,68,68,0.25)",
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}
                  />
                )}
              </Stack>

              {/* Info */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                divider={<Divider flexItem sx={{ borderColor: "rgba(255,255,255,0.12)" }} />}
              >
                <Stack spacing={1.2} sx={{ flex: 1 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <EventOutlinedIcon sx={{ color: "rgba(255,255,255,0.85)" }} />
                    <Typography sx={{ color: "rgba(255,255,255,0.85)" }}>
                      {formatDate(event.startDate)} - {formatDate(event.endDate)}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <PaidOutlinedIcon sx={{ color: "rgba(255,255,255,0.85)" }} />
                    <Typography sx={{ color: "rgba(255,255,255,0.85)" }}>
                      {event.ticketPrice > 0 ? `₹${event.ticketPrice}` : "Free"}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <PersonOutlineOutlinedIcon sx={{ color: "rgba(255,255,255,0.85)" }} />
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar src={event.creator?.avatar || ""} sx={{ width: 26, height: 26 }} />
                      <Typography sx={{ color: "rgba(255,255,255,0.85)" }}>
                        {event.creator?.username || event.creator?.email || "Unknown"}
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>

                <Stack spacing={1.2} sx={{ flex: 1 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <LocationOnOutlinedIcon sx={{ color: "rgba(255,255,255,0.85)" }} />
                    <Typography
                      component="a"
                      href={mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      sx={{
                        color: "rgba(255,255,255,0.9)",
                        textDecoration: "none",
                        "&:hover": { textDecoration: "underline" },
                      }}
                    >
                      {event.location || "Location TBD"}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>

              {/* Buttons */}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <Button
                  onClick={copyLink}
                  variant="outlined"
                  startIcon={<ContentCopyOutlinedIcon />}
                  sx={{
                    borderRadius: "12px",
                    color: "white",
                    borderColor: "rgba(255,255,255,0.28)",
                    "&:hover": {
                      borderColor: "rgba(255,255,255,0.45)",
                      background: "rgba(255,255,255,0.06)",
                    },
                  }}
                >
                  Copy Link
                </Button>

                {!isCreator && (
                  <Button
                    disabled={joinLoading || alreadyJoined || pendingApproval}
                    onClick={handleJoin}
                    variant="contained"
                    sx={{
                      borderRadius: "12px",
                      fontWeight: 800,
                      background: pendingApproval
                        ? "#eab308"
                        : alreadyJoined
                          ? "#22c55e"
                          : "#3b82f6",
                    }}
                  >
                    {joinLoading
                      ? "Joining..."
                      : alreadyJoined
                        ? "Already Joined"
                        : pendingApproval
                          ? "Pending Approval"
                          : event.requireApproval
                            ? "Request to Join"
                            : "Register"}
                  </Button>
                )}

                {isCreator && (
                  <Button
                    disabled={deleteLoading}
                    onClick={() => setConfirmCancelOpen(true)}
                    variant="contained"
                    color="error"
                    sx={{ borderRadius: "12px", fontWeight: 800 }}
                  >
                    {deleteLoading ? "Cancelling..." : "Cancel Event"}
                  </Button>
                )}
              </Stack>

              <Divider sx={{ borderColor: "rgba(255,255,255,0.12)" }} />

              {/* Description */}
              <Box>
                <Typography sx={{ fontSize: "1.1rem", fontWeight: 800, color: "white" }}>
                  Description
                </Typography>

                <Typography
                  sx={{
                    mt: 1.2,
                    color: "rgba(255,255,255,0.88)",
                    lineHeight: 1.85,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {cleanDescription(event.description) || "No description provided."}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={toast.open}
        onClose={() => setToast({ open: false, message: "" })}
        autoHideDuration={2200}
        message={toast.message}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />

      {/* Cancel Dialog */}
      <Dialog open={confirmCancelOpen} onClose={() => setConfirmCancelOpen(false)}>
        <DialogTitle>Cancel this event?</DialogTitle>
        <DialogContent>
          <DialogContentText>This will permanently delete the event.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmCancelOpen(false)} disabled={deleteLoading}>
            Close
          </Button>
          <Button onClick={cancelEvent} disabled={deleteLoading} color="error" variant="contained">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default EventDetails;
