import mongoose from "mongoose";
import Event from "../models/Event.js";
import logger from "../utils/logger.js";
import responseHandler from "../utils/responseHandler.js";

const { errorResponse } = responseHandler;

const isSameObjectId = (a, b) => String(a) === String(b);

export const isEventAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid event ID", "INVALID_ID", 400);
    }

    const event = await Event.findById(id);

    if (!event) {
      return errorResponse(res, "Event not found", "NOT_FOUND", 404);
    }

    if (!req.user || !isSameObjectId(event.creator, req.user._id)) {
      return errorResponse(
        res,
        "Only event creator can perform this action",
        "FORBIDDEN",
        403
      );
    }

    req.event = event;

    next();
  } catch (error) {
    logger.error(`isEventAdmin middleware error: ${error.message}`, error);
    next(error);
  }
};