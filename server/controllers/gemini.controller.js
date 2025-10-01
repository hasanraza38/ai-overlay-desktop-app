import Conversation from "../models/conversation.model.js";
import Chat from "../models/chats.model.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const getGeminiResponse = async (req, res) => {
  try {
    const { userInput, context, conversationId, apiKey, model } = req.body;
    const { userId } = req.user;

    if (!userInput) {
      return res.status(400).json({ error: "User input is required" });
    }
    if (!apiKey || !model) {
      return res.status(400).json({ error: "Gemini API key and model are required" });
    }

    // SSE Setup
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let conversation;
    if (!conversationId) {
      conversation = await Conversation.create({
        userId,
        title: userInput.slice(0, 40),
      });
    } else {
      conversation = await Conversation.findById(conversationId);
    }

    const SYSTEM_PROMPT = `
You are an AI assistant integrated into a universal overlay desktop application. 
This overlay can be opened on any app (VSCode, Gmail, Docs, Browser). 
Your job is to provide structured, professional, and concise responses — always tailored to the user’s request.  
... (same rules as before) ...
`;

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

    const combinedPrompt = (context ? context + "\n\n" : "") + finalPrompt;

    // Gemini client with USER API Key
    const genAI = new GoogleGenerativeAI(apiKey);

    // User-selected model (ex: "gemini-1.5-flash", "gemini-1.5-pro")
    const geminiModel = genAI.getGenerativeModel({ model });

    // Streaming response
    const stream = await geminiModel.generateContentStream([
      { role: "system", parts: [{ text: SYSTEM_PROMPT }] },
      { role: "user", parts: [{ text: combinedPrompt }] },
    ]);

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

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

