import User from "../models/User.js";
import responseHandler from "../utils/responseHandler.js";
import { uploadAvatarImage } from "../utils/cloudinary.js";
import logger from "../utils/logger.js";

const { successResponse, errorResponse } = responseHandler;

// GET PROFILE
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password -__v");

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    return successResponse(res, user);
  } catch (error) {
    return errorResponse(res, "Failed to fetch profile", 500, error);
  }
};

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, bio, socialLinks } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    if (firstName !== undefined) user.firstName = firstName.trim();
    if (lastName !== undefined) user.lastName = lastName.trim();
    if (bio !== undefined) user.bio = bio;

    if (socialLinks) {
      user.socialLinks =
        typeof socialLinks === "string"
          ? JSON.parse(socialLinks)
          : socialLinks;
    }

    if (req.file) {
      const avatarUrl = await uploadAvatarImage(req.file);
      if (avatarUrl) user.avatar = avatarUrl;
    }

    await user.save();

    logger.info(`Profile updated: ${user.email}`);

    const updatedUser = await User.findById(user._id).select("-password -__v");

    return successResponse(res, updatedUser);
  } catch (error) {
    return errorResponse(res, "Failed to update profile", 500, error);
  }
};