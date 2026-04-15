import { body, validationResult } from "express-validator";
import responseHandler from "../utils/responseHandler.js";

const { errorResponse } = responseHandler;

export const handleValidation = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const message = errors
      .array()
      .map((err) => err.msg)
      .join(", ");

    return errorResponse(res, message, 400);
  }

  next();
};

export const validateEventCreation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 200 })
    .withMessage("Title must be 3–200 characters"),

  body("category").trim().notEmpty().withMessage("Category is required"),

  body("startDate")
    .notEmpty()
    .withMessage("Start date is required")
    .isISO8601()
    .withMessage("Invalid start date"),

  body("endDate")
    .notEmpty()
    .withMessage("End date is required")
    .isISO8601()
    .withMessage("Invalid end date")
    .custom((value, { req }) => {
      const start = new Date(req.body.startDate);
      const end = new Date(value);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error("Invalid date values");
      }

      if (end <= start) {
        throw new Error("End date must be after start date");
      }

      return true;
    }),

  body("location").trim().notEmpty().withMessage("Location is required"),

  body("visibility")
    .optional()
    .isIn(["Public", "Private"])
    .withMessage("Invalid visibility"),

  body("requireApproval")
    .optional()
    .isBoolean()
    .withMessage("requireApproval must be boolean"),

  body("ticketPrice")
    .optional()
    .isNumeric()
    .withMessage("ticketPrice must be a number"),

  handleValidation,
];

export const validateProfileUpdate = [
  body("firstName")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("First name too long"),

  body("lastName")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Last name too long"),

  body("username")
    .optional()
    .trim()
    .toLowerCase()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be 3–30 chars")
    .matches(/^[a-z0-9_]+$/)
    .withMessage("Invalid username format"),

  body("bio")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Bio too long"),

  handleValidation,
];