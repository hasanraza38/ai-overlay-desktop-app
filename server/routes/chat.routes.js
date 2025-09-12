import express from "express";
import { saveChat, getChatsByUser, getChatsByConversation } from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/", saveChat); // save new chat
router.get("/user/:userId", getChatsByUser); // fetch all chats of a user
router.get("/conversation/:conversationId", getChatsByConversation); // fetch one conversation

export default router;
