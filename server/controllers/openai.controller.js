import Chat from "../models/chats.model.js";
import User from "../models/user.model.js";
import OpenAI from "openai";
import { SYSTEM_PROMPT } from "../utils/systemPrompt.js";
import { preparePrompt } from "../helpers/preparePrompt.js";

export const getOpenaiResponse = async (req, res) => {
  try {
    const { userInput, context, conversationId, apiKey, model } = req.body;
    const { userId } = req.user;

    if (!userInput) return res.status(400).json({ error: "Input required" });
    if (!apiKey || !model) return res.status(400).json({ error: "OpenAI API key and model are required" });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const user = await validatePlan(req, model, !!apiKey);

    const { combinedPrompt, conversation } = await preparePrompt(conversationId, userId, userInput, context);

    const client = new OpenAI({ apiKey });

    const stream = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: combinedPrompt },
      ],
      stream: true,
    });

    let fullResponse = "";
    for await (const chunk of stream) {
      const token = chunk.choices?.[0]?.delta?.content || "";
      if (token) {
        fullResponse += token;
         res.write(`data: ${JSON.stringify({ token})}\n\n`);
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
    console.error("OpenAI API Error:", err);
    if (!res.headersSent) res.status(403).json({ error: err.message || "Something went wrong" });
  }
};
