const express = require("express");
const router = express.Router();

const { getProfile, updateProfile } = require("../controllers/userController");

const { protect } = require("../middlewares/authMiddleware");
const {
  validateProfileUpdate,
} = require("../middlewares/validationMiddleware");

// Get logged in user profile
router.get("/profile", protect, getProfile);

// Update logged in user profile
router.put("/profile", protect, validateProfileUpdate, updateProfile);

module.exports = router;