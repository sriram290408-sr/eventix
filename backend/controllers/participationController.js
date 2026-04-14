const Participation = require("../models/Participation");
const Event = require("../models/Event");
const { successResponse, errorResponse } = require("../utils/responseHandler");

const isSameObjectId = (a, b) => String(a) === String(b);

// User requests to join an event
const requestToJoin = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return errorResponse(res, "Event not found", "NOT_FOUND", 404);
    }

    // Creator cannot join their own event
    if (isSameObjectId(event.creator, req.user._id)) {
      return errorResponse(res, "You are the event creator", "NOT_ALLOWED", 400);
    }

    // Prevent duplicate requests
    const existing = await Participation.findOne({
      event: event._id,
      user: req.user._id,
    });

    if (existing) {
      return errorResponse(
        res,
        `Already ${existing.status}`,
        "ALREADY_EXISTS",
        400,
      );
    }

    // If approval is required -> pending, else auto approve
    const status = event.requireApproval ? "pending" : "approved";

    const participation = await Participation.create({
      event: event._id,
      user: req.user._id,
      status,
    });

    return successResponse(res, {
      status: participation.status,
      participation,
    });
  } catch (err) {
    return errorResponse(res, "Failed to join event", "ERROR", 500, err);
  }
};

// Event creator sees pending join requests
const getRequests = async (req, res) => {
  try {
    const requests = await Participation.find({
      event: req.params.id,
      status: "pending",
    }).populate("user", "firstName lastName username email");

    return successResponse(res, requests);
  } catch (err) {
    return errorResponse(res, "Failed to fetch requests", "ERROR", 500);
  }
};

const getRequestOr404 = async (eventId, requestId, res) => {
  const request = await Participation.findById(requestId);

  if (!request) {
    errorResponse(res, "Request not found", "NOT_FOUND", 404);
    return null;
  }

  if (!isSameObjectId(request.event, eventId)) {
    errorResponse(res, "Request not found", "NOT_FOUND", 404);
    return null;
  }

  return request;
};

// Approve a pending request
const approveRequest = async (req, res) => {
  try {
    const request = await getRequestOr404(req.params.id, req.params.requestId, res);
    if (!request) return;

    if (request.status !== "pending") {
      return errorResponse(
        res,
        "Only pending requests can be approved",
        "INVALID_STATE",
        400,
      );
    }

    request.status = "approved";
    await request.save();

    return successResponse(res, request);
  } catch (err) {
    return errorResponse(res, "Failed to approve request", "ERROR", 500, err);
  }
};

// Reject a pending request
const rejectRequest = async (req, res) => {
  try {
    const request = await getRequestOr404(req.params.id, req.params.requestId, res);
    if (!request) return;

    if (request.status !== "pending") {
      return errorResponse(
        res,
        "Only pending requests can be rejected",
        "INVALID_STATE",
        400,
      );
    }

    request.status = "rejected";
    await request.save();

    return successResponse(res, request);
  } catch (err) {
    return errorResponse(res, "Failed to reject request", "ERROR", 500, err);
  }
};

// approved guests list
const getGuests = async (req, res) => {
  try {
    const guests = await Participation.find({
      event: req.params.id,
      status: "approved",
    }).populate("user", "firstName lastName username email");

    return successResponse(res, guests);
  } catch (err) {
    return errorResponse(res, "Failed to fetch guests", "ERROR", 500);
  }
};

module.exports = {
  requestToJoin,
  getRequests,
  approveRequest,
  rejectRequest,
  getGuests,
};