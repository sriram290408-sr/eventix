const isProd = process.env.NODE_ENV === "production";

const formatTime = () => new Date().toISOString();

const logger = {
  info: (message) => {
    console.log(`[${formatTime()}] INFO: ${message}`);
  },

  warn: (message) => {
    console.warn(`[${formatTime()}] WARN: ${message}`);
  },

  error: (message, error = null) => {
    console.error(`[${formatTime()}] ERROR: ${message}`);
    
    if (!isProd && error) {
      console.error(error.stack);
    }
  },
};

export default logger;