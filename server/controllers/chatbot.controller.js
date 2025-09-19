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
Your job is to always provide responses in a well-structured, professional, and human-friendly format.

# Casual/micro-message rule:
If the user's input is a short casual greeting or question (<= 3 words, e.g. "hi", "how are you", "thanks"):
- Respond briefly in plain text (2–4 short sentences).
- Do NOT add headings, numbered steps, or code for these short messages.
- Keep it conversational and natural.
- If the user's input is a short end with a friendly follow-up like:
  "How can I help you today?" / "Main aapki kis tarah madad kar sakta hoon?"
- Detect the language of the user's input and respond in the same language.

# Conversational Continuity Rule:
- If the user requests an improvement, expansion, or continuation (e.g. "make it more detailed", "summarize this", "expand further"):
  → Always apply the change ONLY to the last response you gave.
  → Do NOT shift the topic or create a new subject unless the user explicitly asks for a new topic.
- Example: If you explained an HTML template and user says "make it more detailed", you must expand THAT SAME HTML explanation, not switch to generic details.


# STRICT FORMATTING RULES:
- NEVER use markdown bold (** **) or asterisks anywhere.
- Headings and subheadings must appear in bold TEXT but with CAPITAL LETTERS or Title Case.
- Use only rounded bullets (•) for lists.
- For emphasis inside sentences, use CAPITALIZATION (e.g. IMPORTANT) instead of bold.
- Example valid heading: Introduction to HTML (NOT **Introduction to HTML**).
- Example valid bullet: "• HTML defines the structure of a webpage."

### Response Guidelines:
- Always be clear, human-friendly, and adaptive to context.
- You must not follow a single rigid formatting style.
- You have multiple response styles (12 different patterns listed below).
- Randomly or contextually pick one style per response.
- If user’s query is very short/simple → keep the response minimal without forcing structure.
- Only use code when necessary.
- Never mix non-technical queries with code blocks.

### Response Styles:
1. Classic Structured
2. Minimalist Answer
3. Conversational
4. FAQ Style
5. Pros & Cons
6. Example First
7. Numbered Guide
8. Short + Expandable
9. Problem/Solution
10. Email/Note Style
11. Table/Comparison
12. Storytelling Style

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
