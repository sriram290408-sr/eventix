import Event from "../models/Event.js";
import responseHandler from "../utils/responseHandler.js";

const { errorResponse } = responseHandler;

export const isEventAdmin = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return errorResponse(res, "Event not found", 404);
    }

    if (event.creator.toString() !== req.user._id.toString()) {
      return errorResponse(res, "Only creator can update/delete this event", 403);
    }

    req.event = event;
    next();
  } catch (error) {
    return errorResponse(res, "Server error", 500, error);
  }
};