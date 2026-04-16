import Event from "../models/Event.js";
import Participation from "../models/Participation.js";
import generateSlug from "../utils/generateSlug.js";
import { uploadEventImage } from "../utils/cloudinary.js";
import responseHandler from "../utils/responseHandler.js";

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

    // Validate required fields
    if (!title || !description || !category || !startDate || !endDate || !location) {
      return errorResponse(res, "All required fields must be filled", 400);
    }

    // Generate unique slug
    const slug = await generateSlug(title, async (candidateSlug) => {
      const existing = await Event.findOne({ slug: candidateSlug });
      return !!existing;
    });

    // Upload image to cloudinary (base64)
    const uploadedImage = await uploadEventImage(image || "");

    // Create event in DB
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
      isDeleted: false,
    });

    return successResponse(res, event, "Event created successfully", 201);
  } catch (error) {
    return errorResponse(res, error.message || "Failed to create event", 500, error);
  }
};

// GET EVENT BY SLUG
const getEventBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const event = await Event.findOne({
      slug,
      isDeleted: false,
    }).populate("creator", "firstName lastName email avatar");

    if (!event) {
      return errorResponse(res, "Event not found", 404);
    }

    return successResponse(res, event, "Event fetched successfully");
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
    }).sort({ createdAt: -1 });

    return successResponse(res, events, "My events fetched successfully");
  } catch (error) {
    return errorResponse(res, "Failed to fetch my events", 500, error);
  }
};

// GET EVENTS BY CATEGORY
const getEventsByCategory = async (req, res) => {
  try {
    // Decode category (important for Food & Drink)
    const category = decodeURIComponent(req.params.category);

    const events = await Event.find({
      category,
      isDeleted: false,
      status: "published",
    })
      .sort({ startDate: 1 })
      .populate("creator", "firstName lastName email avatar");

    return successResponse(res, events, "Category events fetched successfully");
  } catch (error) {
    return errorResponse(res, "Failed to fetch category events", 500, error);
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
      .populate("creator", "firstName lastName email avatar");

    return successResponse(res, events, "Discover events fetched successfully");
  } catch (error) {
    return errorResponse(res, "Failed to fetch discover events", 500, error);
  }
};

// GET ATTENDING EVENTS
const getAttendingEvents = async (req, res) => {
  try {
    const participations = await Participation.find({
      user: req.user._id,
      status: "approved",
    }).populate({
      path: "event",
      populate: { path: "creator", select: "firstName lastName email avatar" },
    });

    // remove deleted / null events
    const events = participations
      .filter((p) => p.event && p.event.isDeleted === false)
      .map((p) => p.event);

    return successResponse(res, events, "Attending events fetched successfully");
  } catch (error) {
    return errorResponse(res, "Failed to fetch attending events", 500, error);
  }
};

// DELETE EVENT 
const deleteEvent = async (req, res) => {
  try {
    const event = req.event;

    event.isDeleted = true;
    await event.save();

    // remove participations for this event
    await Participation.deleteMany({ event: event._id });

    return successResponse(res, { message: "Event deleted successfully" });
  } catch (error) {
    return errorResponse(res, "Failed to delete event", 500, error);
  }
};

// EXPORT ALL CONTROLLERS
export default {
  createEvent,
  getDiscoverEvents,
  getEventBySlug,
  getMyEvents,
  getEventsByCategory,
  getAttendingEvents,
  deleteEvent,
};