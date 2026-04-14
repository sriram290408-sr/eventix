const jwt = require("jsonwebtoken");
const User = require("../models/User");
const logger = require("../utils/logger");
const { errorResponse } = require("../utils/responseHandler");

const getTokenFromRequest = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) return authHeader.split(" ")[1];
  if (req.cookies?.token) return req.cookies.token;
  return null;
};

const protect = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      return errorResponse(res, "Authentication required", "NO_TOKEN", 401);
    }

    let decoded = null;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      const code = err.name === "TokenExpiredError" ? "TOKEN_EXPIRED" : "INVALID_TOKEN";
      const message = err.name === "TokenExpiredError" ? "Token expired" : "Invalid token";
      return errorResponse(res, message, code, 401);
    }

    if (!decoded?.id) {
      return errorResponse(
        res,
        "Invalid token payload",
        "INVALID_TOKEN_PAYLOAD",
        401,
      );
    }

    const user = await User.findById(decoded.id).select("-password -__v");

    if (!user) {
      return errorResponse(res, "User not found", "USER_NOT_FOUND", 401);
    }

    req.user = user;

    next();
  } catch (error) {
    logger.error(`Auth middleware error: ${error.message}`);

    return errorResponse(res, "Authentication failed", "AUTH_ERROR", 500);
  }
};

module.exports = { protect };
