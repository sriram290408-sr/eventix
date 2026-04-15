const isProd = process.env.NODE_ENV === "production";

const responseHandler = {
  // Success Response
  successResponse: (res, data = null, statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      data,
    });
  },

  // Error Response
  errorResponse: (res, message = "Server Error", statusCode = 500, error = null) => {
    return res.status(statusCode).json({
      success: false,
      message,
      ...(!isProd && error?.stack ? { debug: error.stack } : {}),
    });
  },
};

export default responseHandler;