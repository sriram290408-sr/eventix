import express from "express";
import { getProfile, updateProfile } from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validateProfileUpdate } from "../middlewares/validationMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Get profile
router.get("/profile", protect, getProfile);

// Update profile
router.put(
    "/profile",
    protect,
    upload.single("avatar"),
    validateProfileUpdate,
    updateProfile
);

export default router;