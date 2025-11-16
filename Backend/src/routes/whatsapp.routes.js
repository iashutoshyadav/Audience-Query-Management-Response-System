import express from "express";
import { verifyWhatsapp, receiveWhatsapp } from "../controllers/whatsapp.controller.js";

const router = express.Router();

// Verification required by WhatsApp Cloud API
router.get("/webhook/whatsapp", verifyWhatsapp);

// Receive messages
router.post("/webhook/whatsapp", receiveWhatsapp);

export default router;
