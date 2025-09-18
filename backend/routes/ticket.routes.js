import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { createTicket, getTickets, getTicketById, updateTicketStatus, assignTicket, updateTicketPriority } from "../controllers/ticket.controller.js";
import commentRoutes from "./comment.routes.js";
import activityRoutes from "./activity.routes.js";

const router = express.Router();

router.post("/", protect, createTicket);
router.get("/", protect, getTickets);
router.get("/:id", protect, getTicketById);
router.patch("/:id/status", protect, updateTicketStatus);
router.patch("/:id/assign", protect, assignTicket);
router.patch("/:id/priority", protect, updateTicketPriority);

// Nested routes for comments and activities
router.use("/:ticketId/comments", commentRoutes);
router.use("/:ticketId/activities", activityRoutes);

export default router;
