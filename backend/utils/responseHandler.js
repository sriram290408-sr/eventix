const isProd = process.env.NODE_ENV === "production";

const responseHandler = {
  successResponse: (res, data = null, statusCode = 200, meta = {}) => {
    return res.status(statusCode).json({
      success: true,
      timestamp: new Date().toISOString(),
      ...(Object.keys(meta).length ? { meta } : {}),
      data,
    });
  },

  errorResponse: (
    res,
    message = "Internal Server Error",
    code = "SERVER_ERROR",
    statusCode = 500,
    error = null,
  ) => {
    return res.status(statusCode).json({
      success: false,
      timestamp: new Date().toISOString(),
      message,
      code,
      ...(!isProd && error?.stack ? { debug: error.stack } : {}),
    });
  },
};

module.exports = responseHandler;
