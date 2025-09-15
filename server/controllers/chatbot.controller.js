import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const getChatbotResponse = async (req, res) => {
  try {
    const { userInput, context } = req.body;

    if (!userInput) {
      return res.status(400).json({ error: "User input is required" });
    }

    // Headers set for streaming
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const combinedPrompt = context
      ? `${context}\n\nUser: ${userInput}`
      : userInput;
      
      
    // console.log(combinedPrompt);
      

    const stream = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are a helpful AI chatbot." },
        { role: "user", content: combinedPrompt },
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      const token = chunk?.choices?.[0]?.delta?.content || "";
      if (token) {
        res.write(`data: ${JSON.stringify({ token })}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    console.error("Groq API Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};


export const getChatsByUser = async (req, res) => {
  try {
    const { userId } = req.user;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const chats = await Chat.find({ userId })
      .select("context prompt response createdAt updatedAt") 
      .sort({ createdAt: 1 });

    if (!chats || chats.length === 0) {
      return res.status(404).json({ message: "No chats found for this user" });
    }

    res.json({
      message: "Chats retrieved successfully",
      count: chats.length,
      chats,
    });

  } catch (error) {
    console.error("Get chats error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};



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

