import rateLimit from "express-rate-limit";

const createLimiter = ({ windowMs, max, message }) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message,
    },
  });

export const authLimiter = createLimiter({
  windowMs: 30 * 60 * 1000,
  max: 200,
  message: "Too many authentication attempts. Try again later.",
});

export const eventCreationLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: 50,
  message: "Too many events created. Please slow down.",
});

export const generalLimiter = createLimiter({
  windowMs: 30 * 60 * 1000,
  max: 2000,
  message: "Too many requests. Please try again later.",
});