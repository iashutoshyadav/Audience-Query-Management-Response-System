import express from "express";
import noteCtrl from "../controllers/note.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();
router.use(auth.authenticate);
router.post("/", noteCtrl.create);
router.get("/", noteCtrl.list);

export default router;
