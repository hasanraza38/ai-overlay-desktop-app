import express from "express";
import { deleteConversation, getChatbotResponse, getChatsByConversation, getConversations } from "../controllers/chatbot.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { getOpenaiResponse } from "../controllers/openai.controller.js";
import { getGeminiResponse } from "../controllers/gemini.controller.js";

const router = express.Router();

router.post("/", authenticate, getChatbotResponse);
router.post("/openai", authenticate, getOpenaiResponse);
router.post("/gemini", authenticate, getGeminiResponse);
router.get("/conversations", authenticate, getConversations);
router.get("/conversations/:conversationId", authenticate, getChatsByConversation);
router.delete("/conversations/:conversationId", authenticate, deleteConversation);

export default router;
