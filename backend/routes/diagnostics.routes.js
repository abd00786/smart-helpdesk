import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { runPingTest, getSystemInfo, getDiskInfo, generateDiagnosticLog } from "../controllers/diagnostics.controller.js";

const router = express.Router();

router.post("/ping", protect, runPingTest);
router.get("/system-info", protect, getSystemInfo);
router.get("/disk-info", protect, getDiskInfo);
router.get("/diagnostic-log", protect, generateDiagnosticLog);

export default router;
