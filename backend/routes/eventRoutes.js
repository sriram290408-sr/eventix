import express from "express";

import eventController from "../controllers/eventController.js";
import participationController from "../controllers/participationController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { isEventAdmin } from "../middlewares/roleMiddleware.js";
import { eventCreationLimiter } from "../middlewares/rateLimitMiddleware.js";

import { validateEventCreation } from "../middlewares/validationMiddleware.js";

const router = express.Router();

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

// Get Event by slug
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

export default router;