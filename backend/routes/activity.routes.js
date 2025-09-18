import express from "express";
import { getActivityLog } from "../controllers/activity.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router({ mergeParams: true });

router.get("/", protect, getActivityLog);

export default router;
