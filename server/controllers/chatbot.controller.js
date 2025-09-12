import Groq from "groq-sdk";
import dotenv from "dotenv"
dotenv.config()

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const getChatbotResponse = async (req, res) => {
  try {
    const { userInput } = req.body;

    if (!userInput) {
      return res.status(400).json({ error: "User input is required" });
    }

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // Groq model
      messages: [
        { role: "system", content: "You are a helpful AI chatbot." },
        { role: "user", content: userInput },
      ],
    });

    const reply = response.choices[0].message.content;

    res.json({ reply });
  } catch (error) {
    console.error("Groq API Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
