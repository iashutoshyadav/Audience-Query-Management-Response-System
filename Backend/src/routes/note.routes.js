import express from "express";
import noteCtrl from "../controllers/note.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// All note operations require authentication
router.use(auth.authenticate);

/**
 * POST /api/notes
 * Create a note
 */
router.post("/", noteCtrl.create);

/**
 * GET /api/notes
 * List notes (with optional queryId filter)
 */
router.get("/", noteCtrl.list);

export default router;
