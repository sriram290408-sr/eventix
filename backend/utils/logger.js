const isProd = process.env.NODE_ENV === "production";

const baseLog = (level, message, meta = {}) => {
  const logObject = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
  };

  if (isProd) {
    console.log(JSON.stringify(logObject));
  } else {
    console.log(
      `[${logObject.timestamp}] ${level.toUpperCase().padEnd(5)}: ${message}`,
      Object.keys(meta).length ? meta : "",
    );
  }
};

const logger = {
  info: (message, meta) => baseLog("info", message, meta),

  warn: (message, meta) => baseLog("warn", message, meta),

  error: (message, error = null, meta = {}) => {
    baseLog("error", message, {
      ...meta,
      stack: error?.stack,
      name: error?.name,
    });
  },

  debug: (message, meta) => {
    if (!isProd) baseLog("debug", message, meta);
  },
};

module.exports = logger;
