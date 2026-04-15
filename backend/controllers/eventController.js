import Event from "../models/Event.js";
import Participation from "../models/Participation.js";
import generateSlug from "../utils/generateSlug.js";
import { uploadEventImage } from "../utils/cloudinary.js";
import responseHandler from "../utils/responseHandler.js";
import logger from "../utils/logger.js";

const { successResponse, errorResponse } = responseHandler;

// CREATE EVENT
const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      startDate,
      endDate,
      location,
      locationUrl,
      visibility,
      requireApproval,
      ticketPrice,
      image,
      theme,
    } = req.body;

    if (!title || !description || !category || !startDate || !endDate) {
      return errorResponse(res, "All required fields must be filled", 400);
    }

    const slug = await generateSlug(title, async (candidateSlug) => {
      const existing = await Event.findOne({ slug: candidateSlug });
      return !!existing;
    });

    const uploadedImage = await uploadEventImage(image || "");

    const event = await Event.create({
      title,
      description,
      category,
      startDate,
      endDate,
      location,
      locationUrl: locationUrl || "",
      visibility: visibility || "Public",
      requireApproval: requireApproval ?? true,
      ticketPrice: ticketPrice || 0,
      image: uploadedImage,
      theme: theme || null,
      creator: req.user._id,
      slug,
    });

    logger.info(`Event created: ${event.title}`);

    return successResponse(res, event, 201);
  } catch (error) {
    return errorResponse(res, error.message || "Failed to create event", 500, error);
  }
};

// GET DISCOVER EVENTS
const getDiscoverEvents = async (req, res) => {
  try {
    const { category } = req.query;

    const filter = {
      isDeleted: false,
      status: "published",
      visibility: "Public",
    };

    if (category) {
      filter.category = category;
    }

    const events = await Event.find(filter)
      .sort({ startDate: 1 })
      .populate("creator", "firstName lastName username email avatar");

    return successResponse(res, events);
  } catch (error) {
    return errorResponse(res, "Failed to fetch discover events", 500, error);
  }
};

// GET EVENT BY SLUG
const getEventBySlug = async (req, res) => {
  try {
    const event = await Event.findOne({
      slug: req.params.slug,
      isDeleted: false,
    }).populate("creator", "firstName lastName username email avatar");

    if (!event) {
      return errorResponse(res, "Event not found", 404);
    }

    return successResponse(res, event);
  } catch (error) {
    return errorResponse(res, "Failed to fetch event", 500, error);
  }
};

// GET MY EVENTS
const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({
      creator: req.user._id,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .populate("creator", "username email avatar");

    return successResponse(res, events);
  } catch (error) {
    return errorResponse(res, "Failed to fetch my events", 500, error);
  }
};

// GET EVENTS BY CATEGORY
const getEventsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const events = await Event.find({
      category,
      isDeleted: false,
      status: "published",
    })
      .sort({ startDate: 1 })
      .populate("creator", "firstName lastName username email avatar");

    return successResponse(res, events);
  } catch (error) {
    return errorResponse(res, "Failed to fetch category events", 500, error);
  }
};

// GET ATTENDING EVENTS
const getAttendingEvents = async (req, res) => {
  try {
    const attending = await Participation.find({
      user: req.user._id,
      status: "approved",
    }).populate("event");

    const events = attending.map((p) => p.event);

    return successResponse(res, events);
  } catch (error) {
    return errorResponse(res, "Failed to fetch attending events", 500, error);
  }
};

// UPDATE EVENT
const updateEvent = async (req, res) => {
  try {
    const event = req.event;

    Object.keys(req.body).forEach((key) => {
      event[key] = req.body[key];
    });

    if (req.body.title) {
      event.slug = await generateSlug(req.body.title, async (candidateSlug) => {
        const existing = await Event.findOne({
          slug: candidateSlug,
          _id: { $ne: event._id },
        });
        return !!existing;
      });
    }

    await event.save();

    logger.info(`Event updated: ${event.title}`);

    return successResponse(res, event);
  } catch (error) {
    return errorResponse(res, "Failed to update event", 500, error);
  }
};

// DELETE EVENT
const deleteEvent = async (req, res) => {
  try {
    const event = req.event;

    await Participation.deleteMany({ event: event._id });
    await Event.findByIdAndDelete(event._id);

    logger.info(`Event deleted: ${event.title}`);

    return successResponse(res, { message: "Event deleted successfully" });
  } catch (error) {
    return errorResponse(res, "Failed to delete event", 500, error);
  }
};

export default {
  createEvent,
  getDiscoverEvents,
  getEventBySlug,
  getMyEvents,
  getEventsByCategory,
  getAttendingEvents,
  updateEvent,
  deleteEvent,
};