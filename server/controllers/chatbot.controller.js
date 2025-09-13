import Groq from "groq-sdk";
import dotenv from "dotenv";
import Chat from "../models/chats.model.js"; 

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const getChatbotResponse = async (req, res) => {
  try {
    const { userInput, context } = req.body;
    const { userId } = req.user; 

    if (!userInput) {
      return res.status(400).json({ error: "User input is required" });
    }

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const combinedPrompt = context 
      ? `${context}\n\nUser: ${userInput}` 
      : userInput;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are a helpful AI chatbot." },
        { role: "user", content: combinedPrompt },
      ],
    });

    const reply = response.choices[0].message.content;

    const chat = new Chat({
      userId,
      context: context || "general",
      prompt: userInput,            
      response: reply,
    });

    await chat.save();

    res.json({ reply, chat });
  } catch (error) {
    console.error("Groq API Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

