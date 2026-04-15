import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MyEvent() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const BASE_URL = import.meta.env.VITE_BACKEND_URL || "";

  const fetchMyEvents = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${BASE_URL}/api/v1/events/my-events`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.success) {
        setEvents(res.data?.data || res.data?.data?.events || []);
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error("My Events Fetch Error:", err);

      if (err.response?.status === 401) {
        navigate("/signin", { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/signin", { replace: true });
      return;
    }

    fetchMyEvents();
  }, [token]);

  return (
    <Box sx={{ padding: "30px" }}>
      <Typography variant="h4" sx={{ color: "white", mb: 3 }}>
        My Events
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : events.length === 0 ? (
        <Typography sx={{ color: "gray", textAlign: "center", mt: 5 }}>
          No events created yet.
        </Typography>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {events.map((event) => (
            <Box
              key={event._id}
              sx={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "14px",
                padding: "16px",
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  borderColor: "#64a0fa",
                },
              }}
              onClick={() => navigate(`/private/event/${event.slug}`)}
            >
              <img
                src={
                  event.image ||
                  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600"
                }
                alt={event.title}
                style={{
                  width: "100%",
                  height: "170px",
                  borderRadius: "12px",
                  objectFit: "cover",
                }}
              />

              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "16px",
                  mt: 1.5,
                  color: "white",
                }}
              >
                {event.title}
              </Typography>

              <Typography sx={{ color: "gray", fontSize: "13px", mt: 0.5 }}>
                {event.category} •{" "}
                {event.startDate
                  ? new Date(event.startDate).toLocaleDateString("en-IN")
                  : "No Date"}
              </Typography>

              <Typography sx={{ color: "#64a0fa", fontSize: "13px", mt: 0.5 }}>
                {event.location || "No Location"}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default MyEvent;
