const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { errorResponse, successResponse } = require("../utils/responseHandler");

const normalizeEmail = (email) => String(email || "").toLowerCase().trim();

const buildUsernameFromEmail = (email) => {
  const base = normalizeEmail(email).split("@")[0] || "user";
  return base.replace(/[^a-z0-9_]/gi, "") || "user";
};

const findAvailableUsername = async (baseUsername) => {
  const MAX_ATTEMPTS = 10;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const candidate =
      attempt === 0
        ? baseUsername.toLowerCase()
        : `${baseUsername.toLowerCase()}${Math.floor(Math.random() * 9000 + 1000)}`;

    // eslint-disable-next-line no-await-in-loop
    const exists = await User.findOne({ username: candidate });
    if (!exists) return candidate;
  }

  return null;
};

// ===================== REGISTER =====================
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!email || !password) {
      return errorResponse(
        res,
        "Email and password are required",
        "VALIDATION_ERROR",
        400,
      );
    }

    const normalizedEmail = normalizeEmail(email);

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return errorResponse(res, "User already exists", "ALREADY_EXISTS", 409);
    }

    const baseUsername = buildUsernameFromEmail(normalizedEmail);
    const availableUsername = await findAvailableUsername(baseUsername);

    if (!availableUsername) {
      return errorResponse(
        res,
        "Unable to generate a unique username",
        "SERVER_ERROR",
        500,
      );
    }

    const user = await User.create({
      firstName: firstName?.trim?.() || "",
      lastName: lastName?.trim?.() || "",
      username: availableUsername,
      email: normalizedEmail,
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
          username: user.username,
          email: user.email,
          avatar: user.avatar,
        },
      },
      201,
    );
  } catch (error) {
    return errorResponse(res, error.message || "Registration failed", "ERROR", 500, error);
  }
};

// ===================== LOGIN =====================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(
        res,
        "Email and password are required",
        "VALIDATION_ERROR",
        400,
      );
    }

    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return errorResponse(res, "Invalid email or password", "INVALID_CREDENTIALS", 401);
    }

    // ✅ Correct password check
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return errorResponse(res, "Invalid email or password", "INVALID_CREDENTIALS", 401);
    }

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
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        socialLinks: user.socialLinks,
      },
    });
  } catch (error) {
    return errorResponse(res, "Login failed", "ERROR", 500, error);
  }
};

// ===================== CURRENT USER =====================
const getCurrentUser = async (req, res) => {
  return successResponse(res, req.user);
};

module.exports = { registerUser, loginUser, getCurrentUser };