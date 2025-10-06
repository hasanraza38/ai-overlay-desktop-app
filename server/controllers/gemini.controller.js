import Conversation from "../models/conversation.model.js";
import Chat from "../models/chats.model.js";
import User from "../models/user.model.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT } from "../utils/systemPrompt.js";
import { validatePlan } from "../helpers/validatePlan.js";
import { countTokens } from "../helpers/countToken.js";

export const getGeminiResponse = async (req, res) => {
  try {
    const { userInput, context, conversationId, apiKey, model } = req.body;
    const { userId } = req.user;

    if (!userInput) return res.status(400).json({ error: "Input required" });
    if (!apiKey || !model) return res.status(400).json({ error: "Gemini API key and model are required" });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const user = await validatePlan(userId, model, !!apiKey);

    let conversation;
    if (!conversationId) {
      conversation = await Conversation.create({
        userId,
        title: userInput.slice(0, 40),
      });
    } else {
      conversation = await Conversation.findById(conversationId);
    }

    let finalPrompt = userInput;
    const continuationKeywords = ["continue", "expand", "improve", "summarize", "detail", "aur", "add"];

    if (conversation) {
      const lastChat = await Chat.findOne({ conversationId: conversation._id }).sort({ createdAt: -1 });

      if (lastChat) {
        const isShortReply = userInput.split(" ").length <= 3;
        const containsContinuation = continuationKeywords.some((kw) =>
          userInput.toLowerCase().includes(kw)
        );

        if (isShortReply || containsContinuation) {
          finalPrompt = `
User previously asked: "${lastChat.prompt}"  
Assistant previously answered: "${lastChat.response}"  
Now user says: "${userInput}"  
Continue or update the last response accordingly. Do NOT start a new topic.`;
        }
      }
    }

    const combinedPrompt = `${SYSTEM_PROMPT}\n\n${context ? context + "\n\n" : ""}${finalPrompt}`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const geminiModel = genAI.getGenerativeModel({ model });
    const stream = await geminiModel.generateContentStream(combinedPrompt);

    let fullResponse = "";
    for await (const chunk of stream.stream) {
      const token = chunk.text();
      if (token) {
        fullResponse += token;
        res.write(`data: ${JSON.stringify({ token })}\n\n`);
      }
    }

    await Chat.create({
      userId,
      conversationId: conversation._id,
      prompt: userInput,
      response: fullResponse,
      context: context || "",
    });

    if (user.plan === "free") {
      const tokenCount = countTokens(fullResponse);
      await User.findByIdAndUpdate(userId, { $inc: { tokensUsedToday: tokenCount } });
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) {
    console.error("Gemini API Error:", err);
    if (!res.headersSent) res.status(403).json({ error: err.message || "Something went wrong" });
  }
};
