const logger = require("../utils/logger");
const { errorResponse } = require("../utils/responseHandler");

const errorHandler = (err, req, res, next) => {
  logger.error("API Error", err);

  let statusCode = err.statusCode || 500;
  let code = err.code || "SERVER_ERROR";
  let message = err.message || "Internal Server Error";

  // CastError (invalid Mongo ID)
  if (err.name === "CastError") {
    statusCode = 400;
    code = "INVALID_ID";
    message = "Invalid resource ID";
  }

  // Duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    code = "DUPLICATE_KEY";

    const field = Object.keys(err.keyValue || {})[0];
    message = field ? `Duplicate value for ${field}` : "Duplicate key error";
  }

  // Validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    code = "VALIDATION_ERROR";

    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  return errorResponse(res, message, code, statusCode);
};

const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  error.code = "NOT_FOUND";
  next(error);
};

module.exports = {
  errorHandler,
  notFound,
};