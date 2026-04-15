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

  const BASE_URL = import.meta.env.BACKEND_URL || "";

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);

  const [joinLoading, setJoinLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [participationStatus, setParticipationStatus] = useState(null);

  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);

  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    message: "",
  });

  // ---------------- Toast Message ----------------
  const showToast = (message) => {
    setToast({ open: true, message });
  };

  // ---------------- Fetch Event ----------------
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

      if (data.success) {
        setEvent(data.data.event);
        setParticipationStatus(data.data.participationStatus);
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

  // ---------------- Fetch Requests ----------------
  const fetchRequests = async (eventId) => {
    try {
      setRequestsLoading(true);

      const res = await fetch(`${BASE_URL}/api/v1/events/${eventId}/requests`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setRequests(data.data || []);
      } else {
        setRequests([]);
      }
    } catch (err) {
      console.log("Fetch Requests Error:", err);
      setRequests([]);
    } finally {
      setRequestsLoading(false);
    }
  };

  // ---------------- Approve Request ----------------
  const approveRequest = async (eventId, requestId) => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/v1/events/${eventId}/requests/${requestId}/approve`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (data.success) {
        showToast("Approved");
        fetchRequests(eventId);
      } else {
        showToast(data.message || "Approve failed");
      }
    } catch (err) {
      console.log("Approve Error:", err);
      showToast("Approve failed");
    }
  };

  // ---------------- Reject Request ----------------
  const rejectRequest = async (eventId, requestId) => {
    try {
      const res = await fetch(`${BASE_URL}/api/v1/events/${eventId}/requests/${requestId}/reject`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        showToast("Rejected");
        fetchRequests(eventId);
      } else {
        showToast(data.message || "Reject failed");
      }
    } catch (err) {
      console.log("Reject Error:", err);
      showToast("Reject failed");
    }
  };

  // ---------------- Join Event ----------------
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

      if (data.success) {
        const status = data.data?.status || "approved";
        setParticipationStatus(status);

        if (status === "pending") {
          showToast("Request sent for approval");
        } else {
          showToast("You joined the event!");
        }
      } else {
        showToast(data.message || "Failed to join event");
      }
    } catch (err) {
      console.log("Join Error:", err);
      showToast("Failed to join event");
    } finally {
      setJoinLoading(false);
    }
  };

  // ---------------- Cancel Event ----------------
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

      if (data.success) {
        showToast("Event cancelled");
        navigate("/private/my-event", { replace: true });
      } else {
        showToast(data.message || "Failed to cancel event");
      }
    } catch (err) {
      console.log("Cancel Event Error:", err);
      showToast("Failed to cancel event");
    } finally {
      setDeleteLoading(false);
      setConfirmCancelOpen(false);
    }
  };

  // ---------------- Copy Link ----------------
  const copyLink = async () => {
    try {
      const url = `${window.location.origin}/private/event/${slug}`;
      await navigator.clipboard.writeText(url);
      showToast("Event link copied");
    } catch {
      showToast("Failed to copy link");
    }
  };

  // ---------------- Clean Description ----------------
  const cleanDescription = (desc) => {
    if (!desc) return "";
    if (typeof desc === "string") {
      return desc.replace(/<\/?[^>]+(>|$)/g, "");
    }
    return JSON.stringify(desc);
  };

  // ---------------- Format Date ----------------
  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ---------------- Check Creator ----------------
  const isCreator = event?.creator?._id === user?._id;

  // ---------------- Join Button Condition ----------------
  const canJoin = !isCreator && (!participationStatus || participationStatus === "rejected");

  // ---------------- Google Map Link ----------------
  const mapUrl = event?.locationUrl
    ? event.locationUrl
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        event?.location || "",
      )}`;

  // ---------------- Load Event When Page Opens ----------------
  useEffect(() => {
    if (!token) {
      navigate("/signin", { replace: true });
      return;
    }

    fetchEvent();
  }, [token, slug]);

  // ---------------- Loading ----------------
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress sx={{ color: "#64a0fa" }} />
      </Box>
    );
  }

  // ---------------- Not Found ----------------
  if (!event) {
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <Typography variant="h5" color="white">
          Event not found
        </Typography>
      </Box>
    );
  }

  const heroImage =
    event.image ||
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&auto=format";

  const pageTheme = event.theme || {};

  return (
    <Box sx={{ minHeight: "100vh" }}>
      {/* ✅ Background Video */}
      {pageTheme.video && (
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
          <source src={pageTheme.video} type="video/mp4" />
        </video>
      )}

      {/* ✅ Fixed Background Theme Overlay */}
      <div
        style={{
          position: "fixed",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          zIndex: -1,
          pointerEvents: "none",
          background: pageTheme.video ? "rgba(0,0,0,0.65)" : pageTheme.bg || "#0e0e0e",
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

              {/* Info Section */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                divider={<Divider flexItem sx={{ borderColor: "rgba(255,255,255,0.12)" }} />}
              >
                {/* Left Info */}
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

                {/* Right Info */}
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
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                alignItems={{ xs: "stretch", sm: "center" }}
              >
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

                {canJoin && (
                  <Button
                    disabled={joinLoading}
                    onClick={handleJoin}
                    variant="contained"
                    sx={{
                      borderRadius: "12px",
                      fontWeight: 800,
                      background: "#22c55e",
                      "&:hover": { background: "#16a34a" },
                    }}
                  >
                    {joinLoading
                      ? "Joining..."
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
                    sx={{
                      borderRadius: "12px",
                      fontWeight: 800,
                    }}
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

              {/* Join Requests */}
              {isCreator && (
                <>
                  <Divider sx={{ borderColor: "rgba(255,255,255,0.12)" }} />

                  <Box>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      justifyContent="space-between"
                      spacing={1.5}
                      sx={{ mb: 1.5 }}
                    >
                      <Typography
                        sx={{
                          fontSize: "1.05rem",
                          fontWeight: 850,
                          color: "white",
                        }}
                      >
                        Join Requests
                      </Typography>

                      <Button
                        onClick={() => fetchRequests(event._id)}
                        variant="outlined"
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
                        Refresh
                      </Button>
                    </Stack>

                    {requestsLoading ? (
                      <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                        <CircularProgress size={22} sx={{ color: "#64a0fa" }} />
                      </Box>
                    ) : requests.length === 0 ? (
                      <Typography sx={{ color: "rgba(255,255,255,0.75)" }}>
                        No pending requests
                      </Typography>
                    ) : (
                      <Stack spacing={1.2}>
                        {requests.map((req) => (
                          <Box
                            key={req._id}
                            sx={{
                              p: 1.6,
                              borderRadius: "14px",
                              border: "1px solid rgba(255,255,255,0.14)",
                              background: "rgba(255,255,255,0.05)",
                            }}
                          >
                            <Stack
                              direction={{ xs: "column", sm: "row" }}
                              alignItems={{ xs: "flex-start", sm: "center" }}
                              justifyContent="space-between"
                              spacing={1.2}
                            >
                              <Box>
                                <Typography sx={{ color: "white", fontWeight: 800 }}>
                                  {req.user?.username ||
                                    `${req.user?.firstName || ""} ${
                                      req.user?.lastName || ""
                                    }`.trim() ||
                                    "User"}
                                </Typography>

                                <Typography
                                  sx={{
                                    color: "rgba(255,255,255,0.7)",
                                    fontSize: "0.9rem",
                                    mt: 0.2,
                                  }}
                                >
                                  {req.user?.email || ""}
                                </Typography>
                              </Box>

                              <Stack direction="row" spacing={1}>
                                <Button
                                  onClick={() => approveRequest(event._id, req._id)}
                                  variant="contained"
                                  color="success"
                                  sx={{
                                    borderRadius: "12px",
                                    fontWeight: 800,
                                  }}
                                >
                                  Approve
                                </Button>

                                <Button
                                  onClick={() => rejectRequest(event._id, req._id)}
                                  variant="contained"
                                  color="error"
                                  sx={{
                                    borderRadius: "12px",
                                    fontWeight: 800,
                                  }}
                                >
                                  Reject
                                </Button>
                              </Stack>
                            </Stack>
                          </Box>
                        ))}
                      </Stack>
                    )}
                  </Box>
                </>
              )}
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
          <DialogContentText>
            This will permanently delete the event and all join requests.
          </DialogContentText>
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
