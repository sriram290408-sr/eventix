import express from "express";
import eventController from "../controllers/eventController.js";
import participationController from "../controllers/participationController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { isEventAdmin } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Create Event
router.post("/", protect, eventController.createEvent);

// Discover Events
router.get("/discover", protect, eventController.getDiscoverEvents);

// My Events
router.get("/my-events", protect, eventController.getMyEvents);

// Get Events by Category
router.get("/category/:category", protect, eventController.getEventsByCategory);

// Join Event
router.post("/:id/join", protect, participationController.requestToJoin);

// Requests list
router.get("/:id/requests", protect, isEventAdmin, participationController.getRequests);

// Approve request
router.put("/:id/requests/:requestId/approve", protect, isEventAdmin, participationController.approveRequest);

// Reject request
router.put("/:id/requests/:requestId/reject", protect, isEventAdmin, participationController.rejectRequest);

// Get Event by Slug (KEEP LAST)
router.get("/:slug", protect, eventController.getEventBySlug);

export default router;