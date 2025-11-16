import express from "express";
import aiCtrl from "../controllers/ai.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();
router.use(auth.authenticate);

router.post("/generate", aiCtrl.generate);

export default router;
