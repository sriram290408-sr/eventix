import responseHandler from "../utils/responseHandler.js";

const { errorResponse } = responseHandler;

// 404 Not Found
export const notFound = (req, res) => {
  return errorResponse(res, `Route not found: ${req.originalUrl}`, 404);
};

// Global Error Handler
export const errorHandler = (err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  return errorResponse(res, err.message || "Server Error", 500, err);
};