import express from "express";
import { getChatbotResponse } from "../controllers/chatbot.controller.js";

const router = express.Router();

// POST /api/chatbot
router.post("/", getChatbotResponse);

export default router;
