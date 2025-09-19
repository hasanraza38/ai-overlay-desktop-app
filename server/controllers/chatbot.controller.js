// export const getChatbotResponse = async (req, res) => {
//   try {
//     const { userInput, context } = req.body;

//     if (!userInput) {
//       return res.status(400).json({ error: "User input is required" });
//     }

//     res.setHeader("Content-Type", "text/event-stream");
//     res.setHeader("Cache-Control", "no-cache");
//     res.setHeader("Connection", "keep-alive");

//     const combinedPrompt = `
// You are an AI assistant integrated into a universal overlay desktop application.
// This overlay can be opened on any app (e.g., VSCode, Gmail, Docs, Browser).
// Your job is to always provide responses in a **well-structured, professional, and human-friendly format**.

// ### Response Guidelines:
// 1. **Adaptive Style**
//    - If the query is about **programming or technical tasks**:
//      - Explain step by step.
//      - Use clear section headings.
//      - Add properly formatted code snippets only where necessary.
//    - If the query is about **non-technical tasks** (emails, content writing, explanations, etc.):
//      - Do not show code unnecessarily.
//      - Present the answer in a neat format with headings, bullets, or numbered steps.

// 2. **Formatting**
//    - Use clear headings (### or bold).
//    - Add line breaks between sections for readability.
//    - Keep tone professional but simple to understand.

// 3. **Examples**
//    - For a coding query like: "How to create a React JS project"
//      → Show Introduction, Step-by-step guide, and Code blocks.
//    - For a writing query like: "Write an email to my manager"
//      → Show Subject line, Greeting, Body, and Closing in a professional email format (no code).

// 4. **Important**
//    - Never mix code in non-coding tasks.
//    - Never leave a response in a single paragraph — always format with structure.
//    - Focus on user intent and adapt accordingly.

//    User request:
//    ${context ? `${context}\n\n` : ""}${userInput}
// `;


//     const stream = await groq.chat.completions.create({
//       model: "llama-3.3-70b-versatile",
//       messages: [
//         { role: "system", content: "You are a helpful professional multi language AI assistant." },
//         { role: "user", content: combinedPrompt },
//       ],
//       stream: true,
//     });

//     for await (const chunk of stream) {
//       const token = chunk?.choices?.[0]?.delta?.content || "";
//       if (token) {
//         res.write(`data: ${JSON.stringify({ token })}\n\n`);
//       }
//     }

//     res.write("data: [DONE]\n\n");
//     res.end();
//   } catch (error) {
//     console.error("Groq API Error:", error);
//     res.status(500).json({ error: "Something went wrong" });
//   }
// };








import Groq from "groq-sdk";
import dotenv from "dotenv";


import Conversation from "../models/conversation.model.js";
import Chat from "../models/chats.model.js";
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


export const getChatbotResponse = async (req, res) => {
  try {
    const { userInput, context, conversationId } = req.body;
    const { userId } = req.user;

    if (!userInput) {
      return res.status(400).json({ error: "User input is required" });
    }

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

    const combinedPrompt = `
You are an AI assistant integrated into a universal overlay desktop application.
This overlay can be opened on any app (e.g., VSCode, Gmail, Docs, Browser).
Your job is to always provide responses in a **well-structured, professional, and human-friendly format**.

### Response Guidelines:
1. **Adaptive Style**
   - If the query is about **programming or technical tasks**:
     - Explain step by step.
     - Use clear section headings.
     - Add properly formatted code snippets only where necessary.
   - If the query is about **non-technical tasks** (emails, content writing, explanations, etc.):
     - Do not show code unnecessarily.
     - Present the answer in a neat format with headings, bullets, or numbered steps.

2. **Formatting**
   - Use clear headings (### or bold).
   - Add line breaks between sections for readability.
   - Keep tone professional but simple to understand.

3. **Examples**
   - For a coding query like: "How to create a React JS project"
     → Show Introduction, Step-by-step guide, and Code blocks.
   - For a writing query like: "Write an email to my manager"
     → Show Subject line, Greeting, Body, and Closing in a professional email format (no code).

4. **Important**
   - Never mix code in non-coding tasks.
   - Never leave a response in a single paragraph — always format with structure.
   - Focus on user intent and adapt accordingly.
   
   User request:
   ${context ? `${context}\n\n` : ""}${userInput}
`;


    const stream = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
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
    console.error("Groq API Error:", error);
    res.status(500).json({ error: "Something went wrong" });
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
