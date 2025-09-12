import Chat from "../models/chat.model.js";
import { v4 as uuidv4 } from "uuid";

// Save a new chat message
export const saveChat = async (req, res) => {
  try {
    const { userId, conversationId, prompt, response } = req.body;

    let convId = conversationId;
    if (!convId) {
      convId = uuidv4(); // create new conversation if not passed
    }

    const chat = await Chat.create({
      userId,
      conversationId: convId,
      prompt,
      response,
    });

    res.status(201).json({ message: "Chat saved", data: chat });
  } catch (error) {
    console.error("Save chat error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Get chats by user
export const getChatsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const chats = await Chat.find({ userId }).sort({ createdAt: 1 });
    res.json(chats);
  } catch (error) {
    console.error("Get chats error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Get chats by conversation
export const getChatsByConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const chats = await Chat.find({ conversationId }).sort({ createdAt: 1 });
    res.json(chats);
  } catch (error) {
    console.error("Get chats by conversation error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
