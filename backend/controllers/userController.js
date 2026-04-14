import User from "../models/User.js";
import logger from "../utils/logger.js";
import responseHandler from "../utils/responseHandler.js";

const { successResponse, errorResponse } = responseHandler;

// ====================== GET PROFILE ======================
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password -__v");

    if (!user) {
      return errorResponse(res, "User not found", "NOT_FOUND", 404);
    }

    return successResponse(res, user);
  } catch (error) {
    next(error);
  }
};

// ====================== UPDATE PROFILE ======================
export const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, username, bio, avatar, socialLinks } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return errorResponse(res, "User not found", "NOT_FOUND", 404);
    }

    if (firstName !== undefined) user.firstName = firstName.trim();
    if (lastName !== undefined) user.lastName = lastName.trim();
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;

    if (username && username !== user.username) {
      const normalizedUsername = username.toLowerCase().trim();

      const existing = await User.findOne({
        username: normalizedUsername,
        _id: { $ne: user._id },
      });

      if (existing) {
        return errorResponse(
          res,
          "Username is already taken",
          "VALIDATION_ERROR",
          400
        );
      }

      user.username = normalizedUsername;
    }

    if (socialLinks && typeof socialLinks === "object") {
      user.socialLinks = {
        twitter: socialLinks.twitter ?? user.socialLinks?.twitter ?? "",
        linkedin: socialLinks.linkedin ?? user.socialLinks?.linkedin ?? "",
        instagram: socialLinks.instagram ?? user.socialLinks?.instagram ?? "",
        youtube: socialLinks.youtube ?? user.socialLinks?.youtube ?? "",
        website: socialLinks.website ?? user.socialLinks?.website ?? "",
      };
    }

    await user.save();

    logger.info(`Profile updated: ${user.email}`);

    const updatedUser = await User.findById(user._id).select("-password -__v");

    return successResponse(res, updatedUser);
  } catch (error) {
    next(error);
  }
};