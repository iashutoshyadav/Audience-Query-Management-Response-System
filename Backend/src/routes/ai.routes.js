import express from "express";
import aiCtrl from "../controllers/ai.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Require authentication for all AI routes
router.use(auth.authenticate);

/**
 * POST /api/ai/generate
 * Generate an AI-powered auto reply
 */
router.post("/generate", aiCtrl.generate);

export default router;
