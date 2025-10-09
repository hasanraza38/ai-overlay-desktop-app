import Conversation from "../models/conversation.model.js";
import Chat from "../models/chats.model.js";
import User from "../models/user.model.js";
import { SYSTEM_PROMPT } from "../utils/systemPrompt.js";
import { validatePlan } from "../helpers/validatePlan.js";
import { preparePrompt } from "../helpers/preparePrompt.js";
import { countTokens } from "../helpers/countToken.js";
import { groq } from "../config/groq.js";


export const getChatbotResponse = async (req, res) => {
  try {
    const { userInput, context, conversationId } = req.body;
    const { userId } = req.user;

    if (!userInput) return res.status(400).json({ error: "Input required" });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const user = await validatePlan(userId, "llama-3.3-70b-versatile");

    const { combinedPrompt, conversation } = await preparePrompt(conversationId, userId, userInput, context);

    const stream = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: combinedPrompt },
      ],
      stream: true,
    });

    let fullResponse = "";
    for await (const chunk of stream) {
      const token = chunk?.choices?.[0]?.delta?.content || "";
      if (token) {
        fullResponse += token;
        res.write(`data: ${JSON.stringify({ token })}\n\n`);
      }
    }

    await Chat.create({ userId, conversationId: conversation._id, prompt: userInput, response: fullResponse, context: context || "" });

    if (user.plan === "free") {
      const tokenCount = countTokens(fullResponse);
      await User.findByIdAndUpdate(userId, { $inc: { tokensUsedToday: tokenCount } });
    }

    res.write(`data: ${JSON.stringify({ done: true, conversationId: conversation._id })}\n\n`);
    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) {
    console.error("Groq API Error:", err);
    if (!res.headersSent) res.status(403).json({ error: err.message || "Something went wrong" });
  }
};



export const getConversations = async (req, res) => {
  try {
    const { userId } = req.user;
    const conversations = await Conversation.find({ userId }).sort({ updatedAt: -1 });
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getChatsByConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const chats = await Chat.find({ conversationId }).sort({ createdAt: 1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { userId } = req.user;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId,
    });

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found or unauthorized" });
    }
    await Conversation.deleteOne({ _id: conversationId });

    await Chat.deleteMany({ conversationId });

    res.status(200).json({ message: "Conversation deleted successfully" });
  } catch (error) {
    console.error("Delete Conversation Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};








