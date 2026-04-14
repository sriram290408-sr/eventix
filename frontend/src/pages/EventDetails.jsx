import React, { useCallback, useEffect, useMemo, useState } from "react";
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

function safeJsonParse(maybeJson) {
  if (typeof maybeJson !== "string") return null;
  const trimmed = maybeJson.trim();
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    return null;
  }
}

function stripHtml(html) {
  if (!html || typeof html !== "string") return "";
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<\/?[^>]+(>|$)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tiptapJsonToText(node) {
  if (!node) return "";

  if (typeof node === "string") return node;

  if (Array.isArray(node)) {
    return node.map(tiptapJsonToText).filter(Boolean).join(" ").trim();
  }

  if (typeof node === "object") {
    if (node.type === "text" && typeof node.text === "string") {
      return node.text;
    }

    const parts = [];
    if (node.text && typeof node.text === "string") parts.push(node.text);
    if (node.content) parts.push(tiptapJsonToText(node.content));
    return parts.filter(Boolean).join(" ").trim();
  }

  return "";
}

function descriptionToPlainText(description) {
  if (!description) return "";

  if (typeof description === "string") {
    const parsed = safeJsonParse(description);
    if (parsed) return descriptionToPlainText(parsed);
    return stripHtml(description);
  }

  if (typeof description === "object") {
    return tiptapJsonToText(description);
  }

  return String(description);
}

function getGoogleMapsUrl({ location, locationUrl }) {
  if (locationUrl && typeof locationUrl === "string" && locationUrl.trim()) {
    return locationUrl.trim();
  }

  const q = encodeURIComponent(location || "");
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

function formatDateRange(startDate, endDate) {
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  if (!start || Number.isNaN(start.getTime())) return "";

  const startLabel = start.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  if (!end || Number.isNaN(end.getTime())) return startLabel;

  const endLabel = end.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return `${startLabel} – ${endLabel}`;
}

function EventDetails() {
  const { slug } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [participationStatus, setParticipationStatus] = useState(null); // join gating only
  const [loading, setLoading] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [toast, setToast] = useState({ open: false, message: "" });

  const showToast = useCallback((message) => {
    setToast({ open: true, message });
  }, []);

  // ================= FETCH EVENT =================
  const fetchEvent = useCallback(async () => {
    try {
      if (!token) return;
      setLoading(true);

      const res = await fetch(`/api/v1/events/${slug}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setEvent(data.data.event);
        setParticipationStatus(data.data.participationStatus);
        setRequests([]);
      } else {
        setEvent(null);
      }
    } catch {
      setEvent(null);
    } finally {
      setLoading(false);
    }
  }, [slug, token]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const fetchRequests = useCallback(
    async (eventId) => {
      if (!eventId || !token) return;
      setRequestsLoading(true);
      try {
        const res = await fetch(`/api/v1/events/${eventId}/requests`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data?.success) {
          setRequests(Array.isArray(data.data) ? data.data : []);
        } else {
          setRequests([]);
        }
      } catch {
        setRequests([]);
      } finally {
        setRequestsLoading(false);
      }
    },
    [token],
  );

  const approveRequest = useCallback(
    async (eventId, requestId) => {
      if (!eventId || !requestId || !token) return;
      try {
        const res = await fetch(
          `/api/v1/events/${eventId}/requests/${requestId}/approve`,
          {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await res.json();
        if (data?.success) {
          showToast("Approved");
          fetchRequests(eventId);
        } else {
          showToast(data?.message || "Approve failed");
        }
      } catch {
        showToast("Approve failed");
      }
    },
    [fetchRequests, showToast, token],
  );

  const rejectRequest = useCallback(
    async (eventId, requestId) => {
      if (!eventId || !requestId || !token) return;
      try {
        const res = await fetch(
          `/api/v1/events/${eventId}/requests/${requestId}/reject`,
          {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await res.json();
        if (data?.success) {
          showToast("Rejected");
          fetchRequests(eventId);
        } else {
          showToast(data?.message || "Reject failed");
        }
      } catch {
        showToast("Reject failed");
      }
    },
    [fetchRequests, showToast, token],
  );

  const cancelEvent = useCallback(async () => {
    if (!event?._id || !token) return;

    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/v1/events/${event._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data?.success) {
        showToast("Event cancelled");
        setConfirmCancelOpen(false);
        // Navigate away since this event no longer exists.
        navigate("/private/my-event", { replace: true });
      } else {
        showToast(data?.message || "Failed to cancel event");
      }
    } catch {
      showToast("Failed to cancel event");
    } finally {
      setDeleteLoading(false);
    }
  }, [event?._id, navigate, showToast, token]);

  // ================= COPY LINK =================
  const copyLink = useCallback(async () => {
    try {
      const url = `${window.location.origin}/private/event/${slug}`;
      await navigator.clipboard.writeText(url);
      showToast("Event link copied");
    } catch {
      showToast("Failed to copy link");
    }
  }, [showToast, slug]);

  // ================= JOIN EVENT =================
  const handleJoin = useCallback(async () => {
    try {
      if (!event?._id || !token) return;

      setJoinLoading(true);

      const res = await fetch(`/api/v1/events/${event._id}/join`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        const status =
          data.data?.status || (event.requireApproval ? "pending" : "approved");
        setParticipationStatus(status);
        showToast(
          status === "pending"
            ? "Request sent for approval"
            : "You have joined the event",
        );
      } else {
        showToast(data.message || "Failed to join event");
      }
    } catch {
      showToast("Failed to join event");
    } finally {
      setJoinLoading(false);
    }
  }, [event?._id, event?.requireApproval, showToast, token]);

  // ================= UI CONDITIONS =================
  const isCreator = useMemo(
    () => event?.creator?._id && user?._id && event.creator._id === user._id,
    [event?.creator?._id, user?._id],
  );

  const canJoin = useMemo(() => {
    if (!event?._id) return false;
    if (isCreator) return false;
    return !participationStatus || participationStatus === "rejected";
  }, [event?._id, isCreator, participationStatus]);

  const descriptionText = useMemo(
    () => descriptionToPlainText(event?.description),
    [event?.description],
  );

  const mapHref = useMemo(
    () =>
      getGoogleMapsUrl({
        location: event?.location || "",
        locationUrl: event?.locationUrl || "",
      }),
    [event?.location, event?.locationUrl],
  );

  const dateRange = useMemo(
    () => formatDateRange(event?.startDate, event?.endDate),
    [event?.startDate, event?.endDate],
  );

  // ================= LOADING =================
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress sx={{ color: "#64a0fa" }} />
      </Box>
    );
  }

  // ================= EVENT NOT FOUND =================
  if (!event) {
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <Typography variant="h5" color="white">
          Event not found
        </Typography>
      </Box>
    );
  }

  const pageTheme = event.theme || {};
  const pageFont = pageTheme.font || undefined;
  const heroImage =
    event.image ||
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&auto=format";

  return (
    <Box sx={{ fontFamily: pageFont, minHeight: "100vh" }}>
      {/* Background (from event theme) */}
      {pageTheme.video && (
        <video
          key={pageTheme.video}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
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

      <div
        style={{
          position: "fixed",
          width: "100%",
          height: "100%",
          background:
            pageTheme.bg ||
            (pageTheme.video ? "rgba(0,0,0,0.35)" : "#0e0e0e"),
          opacity: pageTheme.video ? 0.55 : 1,
          top: 0,
          left: 0,
          zIndex: -1,
          pointerEvents: "none",
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
          <Box sx={{ position: "relative" }}>
            <Box
              component="img"
              src={heroImage}
              alt={event.title || "Event"}
              loading="lazy"
              sx={{
                width: "100%",
                height: { xs: 220, sm: 320 },
                objectFit: "cover",
                display: "block",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.80) 100%)",
              }}
            />
          </Box>

          <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
            <Stack spacing={2.2}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                alignItems={{ xs: "flex-start", sm: "center" }}
                justifyContent="space-between"
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 850,
                    color: "white",
                    fontSize: { xs: "2rem", sm: "2.4rem" },
                    lineHeight: 1.15,
                  }}
                >
                  {event.title}
                </Typography>
              </Stack>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                divider={
                  <Divider
                    flexItem
                    sx={{ borderColor: "rgba(255,255,255,0.12)" }}
                  />
                }
              >
                <Stack spacing={1.2} sx={{ flex: 1 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <EventOutlinedIcon sx={{ color: "rgba(255,255,255,0.85)" }} />
                    <Typography sx={{ color: "rgba(255,255,255,0.85)" }}>
                      {dateRange || "Date TBD"}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <PaidOutlinedIcon sx={{ color: "rgba(255,255,255,0.85)" }} />
                    <Typography sx={{ color: "rgba(255,255,255,0.85)" }}>
                      {event.ticketPrice > 0 ? `₹${event.ticketPrice}` : "Free"}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <PersonOutlineOutlinedIcon
                      sx={{ color: "rgba(255,255,255,0.85)" }}
                    />
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar
                        src={event.creator?.avatar || ""}
                        sx={{ width: 26, height: 26 }}
                      />
                      <Typography sx={{ color: "rgba(255,255,255,0.85)" }}>
                        {event.creator?.username ||
                          event.creator?.email ||
                          "Unknown"}
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>

                <Stack spacing={1.2} sx={{ flex: 1 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <LocationOnOutlinedIcon
                      sx={{ color: "rgba(255,255,255,0.85)" }}
                    />
                    <Typography
                      component="a"
                      href={mapHref}
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

              <Box>
                <Typography
                  sx={{ fontSize: "1.1rem", fontWeight: 800, color: "white" }}
                >
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
                  {descriptionText || "No description provided."}
                </Typography>
              </Box>

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
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          py: 3,
                        }}
                      >
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
                                <Typography
                                  sx={{
                                    color: "white",
                                    fontWeight: 800,
                                    lineHeight: 1.2,
                                  }}
                                >
                                  {req.user?.username ||
                                    `${req.user?.firstName || ""} ${req.user?.lastName || ""}`.trim() ||
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
                                  onClick={() =>
                                    approveRequest(event._id, req._id)
                                  }
                                  variant="contained"
                                  color="success"
                                  sx={{ borderRadius: "12px", fontWeight: 800 }}
                                >
                                  Approve
                                </Button>
                                <Button
                                  onClick={() =>
                                    rejectRequest(event._id, req._id)
                                  }
                                  variant="contained"
                                  color="error"
                                  sx={{ borderRadius: "12px", fontWeight: 800 }}
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

      <Snackbar
        open={toast.open}
        onClose={() => setToast({ open: false, message: "" })}
        autoHideDuration={2200}
        message={toast.message}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />

      <Dialog
        open={confirmCancelOpen}
        onClose={() => (deleteLoading ? null : setConfirmCancelOpen(false))}
      >
        <DialogTitle>Cancel this event?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently delete the event and all join requests.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmCancelOpen(false)}
            disabled={deleteLoading}
          >
            Close
          </Button>
          <Button
            onClick={cancelEvent}
            disabled={deleteLoading}
            color="error"
            variant="contained"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default EventDetails;