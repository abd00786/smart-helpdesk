import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getTicketStats, getSLAMetrics, getTicketTrends, getResolutionTimeHeatmap } from "../controllers/analytics.controller.js";

const router = express.Router();

router.get("/stats", protect, getTicketStats);
router.get("/sla-metrics", protect, getSLAMetrics);
router.get("/trends", protect, getTicketTrends);
router.get("/resolution-heatmap", protect, getResolutionTimeHeatmap);

export default router;
