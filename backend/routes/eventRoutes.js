import express from "express";
import eventController from "../controllers/eventController.js";
import participationController from "../controllers/participationController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { isEventAdmin } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// CREATE EVENT
router.post("/", protect, eventController.createEvent);

// DISCOVER EVENTS
router.get("/discover", protect, eventController.getDiscoverEvents);

// MY EVENTS
router.get("/my-events", protect, eventController.getMyEvents);

// ATTENDING EVENTS
router.get("/attending", protect, eventController.getAttendingEvents);

// EVENTS BY CATEGORY
router.get("/category/:category", protect, eventController.getEventsByCategory);

// JOIN EVENT
router.post("/:id/join", protect, participationController.requestToJoin);

// REQUESTS LIST 
router.get(
    "/:id/requests",
    protect,
    isEventAdmin,
    participationController.getRequests
);

// APPROVE REQUEST
router.put(
    "/:id/requests/:requestId/approve",
    protect,
    isEventAdmin,
    participationController.approveRequest
);

// REJECT REQUEST
router.put(
    "/:id/requests/:requestId/reject",
    protect,
    isEventAdmin,
    participationController.rejectRequest
);

// DELETE EVENT 
router.delete("/:id", protect, isEventAdmin, eventController.deleteEvent);

// GET EVENT BY SLUG 
router.get("/:slug", protect, eventController.getEventBySlug);

export default router;