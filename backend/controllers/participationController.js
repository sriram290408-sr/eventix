import Participation from "../models/Participation.js";
import Event from "../models/Event.js";
import responseHandler from "../utils/responseHandler.js";

const { successResponse, errorResponse } = responseHandler;

// REQUEST TO JOIN
const requestToJoin = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return errorResponse(res, "Event not found", 404);
    }

    if (event.creator.toString() === req.user._id.toString()) {
      return errorResponse(res, "You are the event creator", 400);
    }

    const existing = await Participation.findOne({
      event: event._id,
      user: req.user._id,
    });

    if (existing) {
      return errorResponse(res, `Already ${existing.status}`, 400);
    }

    const status = event.requireApproval ? "pending" : "approved";

    const participation = await Participation.create({
      event: event._id,
      user: req.user._id,
      status,
    });

    return successResponse(res, participation, 201);
  } catch (err) {
    return errorResponse(res, "Failed to join event", 500, err);
  }
};

// GET PENDING REQUESTS
const getRequests = async (req, res) => {
  try {
    const requests = await Participation.find({
      event: req.params.id,
      status: "pending",
    }).populate("user", "firstName lastName username email");

    return successResponse(res, requests);
  } catch (err) {
    return errorResponse(res, "Failed to fetch requests", 500);
  }
};

// APPROVE REQUEST
const approveRequest = async (req, res) => {
  try {
    const request = await Participation.findById(req.params.requestId);

    if (!request) {
      return errorResponse(res, "Request not found", 404);
    }

    if (request.status !== "pending") {
      return errorResponse(res, "Only pending requests can be approved", 400);
    }

    request.status = "approved";
    await request.save();

    return successResponse(res, request);
  } catch (err) {
    return errorResponse(res, "Failed to approve request", 500, err);
  }
};

// REJECT REQUEST
const rejectRequest = async (req, res) => {
  try {
    const request = await Participation.findById(req.params.requestId);

    if (!request) {
      return errorResponse(res, "Request not found", 404);
    }

    if (request.status !== "pending") {
      return errorResponse(res, "Only pending requests can be rejected", 400);
    }

    request.status = "rejected";
    await request.save();

    return successResponse(res, request);
  } catch (err) {
    return errorResponse(res, "Failed to reject request", 500, err);
  }
};

// GET APPROVED GUESTS
const getGuests = async (req, res) => {
  try {
    const guests = await Participation.find({
      event: req.params.id,
      status: "approved",
    }).populate("user", "firstName lastName username email");

    return successResponse(res, guests);
  } catch (err) {
    return errorResponse(res, "Failed to fetch guests", 500);
  }
};

export default {
  requestToJoin,
  getRequests,
  approveRequest,
  rejectRequest,
  getGuests,
};