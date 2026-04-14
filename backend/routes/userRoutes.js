import express from "express";

import { getProfile, updateProfile } from "../controllers/userController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { validateProfileUpdate } from "../middlewares/validationMiddleware.js";

const router = express.Router();

// Get logged in user profile
router.get("/profile", protect, getProfile);

// Update logged in user profile
router.put("/profile", protect, validateProfileUpdate, updateProfile);

export default router;