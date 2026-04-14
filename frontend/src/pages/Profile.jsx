import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  InputAdornment,
  Grid,
} from "@mui/material";

import {
  Instagram,
  YouTube,
  LinkedIn,
  Language,
  AccountCircle,
  CameraAlt,
} from "@mui/icons-material";

import { useAuth } from "../context/AuthContext";

const darkBg = "#0e0e0e";
const cardBg = "#1a1a1a";
const borderColor = "#2a2a2a";
const labelColor = "#aaaaaa";
const inputText = "#ffffff";
const placeholderColor = "#555555";
const prefixBg = "#222222";

const inputSx = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: cardBg,
    borderRadius: "10px",
    color: inputText,
    fontSize: "0.9rem",
    "& fieldset": { borderColor },
    "&:hover fieldset": { borderColor: "#444" },
    "&.Mui-focused fieldset": { borderColor: "#666" },
  },
  "& input::placeholder, & textarea::placeholder": {
    color: placeholderColor,
    opacity: 1,
  },
  "& .MuiInputAdornment-root": {
    color: placeholderColor,
  },
};

const labelSx = {
  color: labelColor,
  fontSize: "0.85rem",
  fontWeight: 500,
  mb: 0.8,
  display: "block",
  fontFamily: "'DM Sans', sans-serif",
};

function SocialField({ prefix, placeholder, icon, value, onChange }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        backgroundColor: cardBg,
        border: `1px solid ${borderColor}`,
        borderRadius: "10px",
        overflow: "hidden",
        height: "44px",
      }}
    >
      <Box sx={{ px: 1, color: placeholderColor }}>{icon}</Box>

      {prefix && (
        <Box
          sx={{
            px: 1.2,
            backgroundColor: prefixBg,
            color: "#888",
            fontSize: "0.8rem",
            display: "flex",
            alignItems: "center",
            borderRight: `1px solid ${borderColor}`,
          }}
        >
          {prefix}
        </Box>
      )}

      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          flex: 1,
          background: "transparent",
          border: "none",
          outline: "none",
          color: inputText,
          fontSize: "0.85rem",
          padding: "0 12px",
          height: "100%",
        }}
      />
    </Box>
  );
}

function ProfilePage() {
  const { token, updateUser } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");

  const [social, setSocial] = useState({
    instagram: "",
    youtube: "",
    linkedin: "",
    website: "",
    twitter: "",
  });

  const [profileLoading, setProfileLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // ================= FETCH PROFILE =================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!token) return;

        setProfileLoading(true);

        const res = await fetch("/api/v1/users/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (data.success) {
          const user = data.data;

          setFirstName(user.firstName || "");
          setLastName(user.lastName || "");
          setUsername(user.username || "");
          setBio(user.bio || "");
          setAvatar(user.avatar || "");

          setSocial({
            instagram: user.socialLinks?.instagram || "",
            youtube: user.socialLinks?.youtube || "",
            linkedin: user.socialLinks?.linkedin || "",
            website: user.socialLinks?.website || "",
            twitter: user.socialLinks?.twitter || "",
          });

          // ✅ Update AuthContext user also
          updateUser(user);
        }
      } catch {
        // keep UI silent for now
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [token, updateUser]);

  // ================= AVATAR UPLOAD =================
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setAvatar(previewUrl);
    }
  };

  // ================= SAVE PROFILE =================
  const handleSave = async () => {
    try {
      if (!token) return alert("Token missing. Please login again.");

      setSaving(true);

      const profileData = {
        firstName,
        lastName,
        username,
        bio,
        avatar,
        socialLinks: social,
      };

      const res = await fetch("/api/v1/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      const data = await res.json();

      if (data.success) {
        updateUser(data.data);
        alert("Profile saved successfully!");
      } else {
        alert(data.message || "Failed to save profile");
      }
    } catch {
      alert("Error saving profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: darkBg,
        display: "flex",
        justifyContent: "center",
        py: 6,
        px: 2,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 760 }}>
        <Typography sx={{ fontSize: "1.6rem", fontWeight: 700, color: "#fff" }}>
          Your Profile
        </Typography>

        <Typography sx={{ color: labelColor, mb: 4 }}>
          Choose how you are displayed as a host or guest.
        </Typography>

        {/* Name + Avatar */}
        <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={labelSx}>First Name</Typography>
            <TextField
              fullWidth
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              sx={inputSx}
              size="small"
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography sx={labelSx}>Last Name</Typography>
            <TextField
              fullWidth
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              sx={inputSx}
              size="small"
            />
          </Box>

          <Box sx={{ textAlign: "center" }}>
            <Typography sx={labelSx}>Profile Picture</Typography>

            <Box sx={{ position: "relative" }}>
              <Avatar
                src={avatar}
                sx={{ width: 80, height: 80, bgcolor: "#333" }}
              />

              <label htmlFor="avatar-upload">
                <input
                  id="avatar-upload"
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleAvatarUpload}
                />

                <IconButton
                  component="span"
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    background: "#222",
                    color: "#fff",
                    "&:hover": {
                      background: "#333",
                    },
                  }}
                >
                  <CameraAlt fontSize="small" />
                </IconButton>
              </label>
            </Box>
          </Box>
        </Box>

        {/* Username */}
        <Box sx={{ mb: 3 }}>
          <Typography sx={labelSx}>Username</Typography>
          <TextField
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{color:"white"}}>@</InputAdornment>
              ),
            }}
            sx={inputSx}
            size="small"
          />
        </Box>

        {/* Bio */}
        <Box sx={{ mb: 4 }}>
          <Typography sx={labelSx}>Bio</Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            sx={inputSx}
          />
        </Box>

        {/* Social */}
        <Typography sx={{ color: "#fff", mb: 2 }}>Social Links</Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <SocialField
              prefix="instagram.com/"
              placeholder="username"
              icon={<Instagram />}
              value={social.instagram}
              onChange={(e) =>
                setSocial({ ...social, instagram: e.target.value })
              }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <SocialField
              prefix="youtube.com/@"
              placeholder="username"
              icon={<YouTube />}
              value={social.youtube}
              onChange={(e) =>
                setSocial({ ...social, youtube: e.target.value })
              }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <SocialField
              prefix="linkedin.com/in/"
              placeholder="username"
              icon={<LinkedIn />}
              value={social.linkedin}
              onChange={(e) =>
                setSocial({ ...social, linkedin: e.target.value })
              }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <SocialField
              prefix=""
              placeholder="Website"
              icon={<Language />}
              value={social.website}
              onChange={(e) =>
                setSocial({ ...social, website: e.target.value })
              }
            />
          </Grid>
        </Grid>

        <Button
          disabled={saving || profileLoading}
          onClick={handleSave}
          startIcon={<AccountCircle />}
          sx={{
            mt: 4,
            background: "#fff",
            color: "#000",
            fontWeight: "600",
            px: 3,
            borderRadius: "10px",
            "&:hover": {
              background: "#ddd",
            },
          }}
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </Box>
    </Box>
  );
}

export default ProfilePage;
