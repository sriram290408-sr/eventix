import User from "../models/User.js";
import logger from "../utils/logger.js";
import responseHandler from "../utils/responseHandler.js";
import { uploadAvatarImage } from "../utils/cloudinary.js";

const { successResponse, errorResponse } = responseHandler;

// GET PROFILE
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password -__v");

    if (!user) {
      return errorResponse(res, "User not found", "NOT_FOUND", 404);
    }

    return successResponse(res, user);
  } catch (error) {
    return errorResponse(res, "Failed to fetch profile", "ERROR", 500, error);
  }
};

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, username, bio } = req.body;

    let socialLinks = req.body.socialLinks;

    if (socialLinks && typeof socialLinks === "string") {
      try {
        socialLinks = JSON.parse(socialLinks);
      } catch {
        socialLinks = null;
      }
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return errorResponse(res, "User not found", "NOT_FOUND", 404);
    }

    if (firstName !== undefined) user.firstName = firstName.trim();
    if (lastName !== undefined) user.lastName = lastName.trim();
    if (bio !== undefined) user.bio = bio;

    if (username && username !== user.username) {
      const normalizedUsername = username.toLowerCase().trim();

      const existing = await User.findOne({
        username: normalizedUsername,
        _id: { $ne: user._id },
      });

      if (existing) {
        return errorResponse(
          res,
          "Username already taken",
          "VALIDATION_ERROR",
          400
        );
      }

      user.username = normalizedUsername;
    }

    if (socialLinks && typeof socialLinks === "object") {
      user.socialLinks = {
        instagram: socialLinks.instagram || "",
        youtube: socialLinks.youtube || "",
        linkedin: socialLinks.linkedin || "",
        website: socialLinks.website || "",
      };
    }

    // Upload avatar to cloudinary
    if (req.file) {
      const avatarUrl = await uploadAvatarImage(req.file);
      if (avatarUrl) user.avatar = avatarUrl;
    }

    await user.save();

    logger.info(`Profile updated: ${user.email}`);

    const updatedUser = await User.findById(user._id).select("-password -__v");

    return successResponse(res, updatedUser);
  } catch (error) {
    return errorResponse(res, "Failed to update profile", "ERROR", 500, error);
  }
};