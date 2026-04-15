import Event from "../models/Event.js";
import Participation from "../models/Participation.js";
import generateSlug from "../utils/generateSlug.js";
import logger from "../utils/logger.js";
import { uploadEventImage } from "../utils/cloudinary.js";
import responseHandler from "../utils/responseHandler.js";

const { successResponse, errorResponse } = responseHandler;

const buildDiscoverFilter = (category) => {
  const filter = {
    isDeleted: false,
    status: "published",
    visibility: "Public",
  };

  if (category) filter.category = category;
  return filter;
};

const addParticipationStatusToEvents = async (events, userId) => {
  const eventIds = events.map((e) => e._id);

  const participations = await Participation.find({
    user: userId,
    event: { $in: eventIds },
  }).select("event status");

  const statusByEventId = new Map(
    participations.map((p) => [String(p.event), p.status])
  );

  return events.map((e) => ({
    ...e.toObject(),
    participationStatus: statusByEventId.get(String(e._id)) || null,
  }));
};

// CREATE EVENT
const createEvent = async (req, res, next) => {
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
      requireApproval: requireApproval || false,
      ticketPrice: ticketPrice || 0,
      image: uploadedImage,
      theme: theme || null,
      creator: req.user._id,
      slug,
    });

    logger.info(`Event created: ${title} (${req.user.email})`);

    return successResponse(res, event, 201);
  } catch (error) {
    next(error);
  }
};

// GET DISCOVER EVENTS
const getDiscoverEvents = async (req, res) => {
  try {
    const { category } = req.query;

    const filter = buildDiscoverFilter(category);

    const events = await Event.find(filter)
      .sort({ startDate: 1 })
      .populate("creator", "firstName lastName username email avatar");

    const enrichedEvents = await addParticipationStatusToEvents(
      events,
      req.user._id
    );

    return successResponse(res, enrichedEvents);
  } catch (err) {
    return errorResponse(res, "Failed to fetch discover events", "ERROR", 500);
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
      return errorResponse(res, "Event not found", "NOT_FOUND", 404);
    }

    const participation = await Participation.findOne({
      event: event._id,
      user: req.user._id,
    });

    const participationStatus = participation?.status || null;

    return successResponse(res, {
      event,
      participationStatus,
    });
  } catch (err) {
    return errorResponse(res, "Failed to fetch event", "ERROR", 500, err);
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
  } catch (err) {
    return errorResponse(res, "Failed to fetch my events", "ERROR", 500);
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

    const enrichedEvents = await addParticipationStatusToEvents(
      events,
      req.user._id
    );

    return successResponse(res, enrichedEvents);
  } catch (err) {
    return errorResponse(res, "Failed to fetch category events", "ERROR", 500);
  }
};

// GET ATTENDING EVENTS
const getAttendingEvents = async (req, res) => {
  try {
    const attending = await Participation.find({
      user: req.user._id,
      status: "approved",
    }).populate({
      path: "event",
      populate: {
        path: "creator",
        select: "firstName lastName username email avatar",
      },
    });

    const events = attending
      .map((p) => p.event)
      .filter((e) => e && e.isDeleted !== true);

    return successResponse(res, events);
  } catch (err) {
    return errorResponse(res, "Failed to fetch attending events", "ERROR", 500);
  }
};

// UPDATE EVENT
const updateEvent = async (req, res, next) => {
  try {
    const event = req.event;

    const allowedFields = [
      "title",
      "description",
      "category",
      "startDate",
      "endDate",
      "location",
      "locationUrl",
      "visibility",
      "requireApproval",
      "ticketPrice",
      "image",
      "theme",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        event[field] = req.body[field];
      }
    });

    if (req.body.title && req.body.title !== event.title) {
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
    next(error);
  }
};

// DELETE EVENT
const deleteEvent = async (req, res, next) => {
  try {
    const event = req.event;

    await Participation.deleteMany({ event: event._id });
    await Event.findByIdAndDelete(event._id);

    logger.info(`Event deleted: ${event.title}`);

    return successResponse(res, {
      message: "Event deleted successfully",
    });
  } catch (error) {
    next(error);
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