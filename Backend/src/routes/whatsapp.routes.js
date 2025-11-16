import express from "express";
import { verifyWhatsapp, receiveWhatsapp } from "../controllers/whatsapp.controller.js";

const router = express.Router();
router.get("/webhook/whatsapp", verifyWhatsapp);
router.post("/webhook/whatsapp", receiveWhatsapp);

export default router;
