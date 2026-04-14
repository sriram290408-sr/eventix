const express = require("express");
const router = express.Router();

const eventController = require("../controllers/eventController");
const participationController = require("../controllers/participationController");

const { protect } = require("../middlewares/authMiddleware");
const { isEventAdmin } = require("../middlewares/roleMiddleware");
const { eventCreationLimiter } = require("../middlewares/rateLimitMiddleware");

const {
  validateEventCreation,
} = require("../middlewares/validationMiddleware");

// Discover Events
router.get("/discover", protect, eventController.getDiscoverEvents);

// Create Event
router.post(
  "/",
  protect,
  eventCreationLimiter,
  validateEventCreation,
  eventController.createEvent
);

// My Events
router.get("/my-events", protect, eventController.getMyEvents);

// Attending Events
router.get("/attending", protect, eventController.getAttendingEvents);

// Get Event by slug (IMPORTANT FIX)
router.get("/:slug", protect, eventController.getEventBySlug);

// Update/Delete Event
router.put("/:id", protect, isEventAdmin, eventController.updateEvent);
router.delete("/:id", protect, isEventAdmin, eventController.deleteEvent);

// Join Event
router.post("/:id/join", protect, participationController.requestToJoin);

// Requests list
router.get(
  "/:id/requests",
  protect,
  isEventAdmin,
  participationController.getRequests
);

// Approve request
router.put(
  "/:id/requests/:requestId/approve",
  protect,
  isEventAdmin,
  participationController.approveRequest
);

// Reject request
router.put(
  "/:id/requests/:requestId/reject",
  protect,
  isEventAdmin,
  participationController.rejectRequest
);

module.exports = router;