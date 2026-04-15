import jwt from "jsonwebtoken";
import User from "../models/User.js";
import responseHandler from "../utils/responseHandler.js";

const { errorResponse, successResponse } = responseHandler;

// REGISTER
export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validation
    if (!firstName || !email || !password) {
      return errorResponse(res, "First name, Email and Password are required", 400);
    }

    // Check existing user
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return errorResponse(res, "User already exists", 409);
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
    });

    return successResponse(
      res,
      {
        message: "Registered successfully. Please login.",
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          avatar: user.avatar,
        },
      },
      201
    );
  } catch (error) {
    return errorResponse(res, error.message || "Registration failed", 500);
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return errorResponse(res, "Email and password are required", 400);
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return errorResponse(res, "Invalid email or password", 401);
    }

    // Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return errorResponse(res, "Invalid email or password", 401);
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return successResponse(res, {
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        socialLinks: user.socialLinks,
      },
    });
  } catch (error) {
    return errorResponse(res, error.message || "Login failed", 500);
  }
};

// CURRENT USER
export const getCurrentUser = async (req, res) => {
  return successResponse(res, req.user);
};