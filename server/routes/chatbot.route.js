import express from "express";
import { getChatbotResponse, getChatsByUser } from "../controllers/chatbot.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authenticate, getChatbotResponse);
router.get("/", authenticate, getChatsByUser);

export default router;
