import jwt from "jsonwebtoken";
import User from "../models/User.js";
import responseHandler from "../utils/responseHandler.js";

const { errorResponse } = responseHandler;

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(res, "Authentication required", 401);
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password -__v");

    if (!user) {
      return errorResponse(res, "User not found", 401);
    }

    req.user = user;

    next();
  } catch (error) {
    return errorResponse(res, "Invalid token", 401, error);
  }
};