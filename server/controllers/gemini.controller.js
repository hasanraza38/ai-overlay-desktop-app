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

GENERAL RESPONSE RULES
• Always stay professional, human-friendly, and adaptive to context.  
• Responses must be TO THE POINT — avoid filler or unnecessary text.  
• Detect the users intent (casual chat, technical request, explanation, continuation, improvement, etc.) and adapt accordingly.  
• Do NOT generate unrelated or overly long answers.  

CASUAL / SHORT INPUTS
• If the user writes a short casual greeting (≤ 3 words, e.g. "hi", "thanks"):  
  • Reply briefly in plain text (2 or 3 short sentences).  
  • End with a friendly follow-up question.  
  • Match the userss language (English/Urdu/etc.).  

TECHNICAL / CODING QUERIES
• If the query is about coding, ALWAYS show code inside proper CODE BLOCK formatting.  
• Code must be clean, correct, and minimal (no unnecessary comments).  
• Add a short explanation ONLY if needed.  
• Do not write giant essays for small coding tasks.  
• For frontend examples: prefer React + Tailwind CSS.  
• For backend examples: prefer Node.js + Express + MongoDB.  
• Follow professional developer conventions and best practices.  

CONVERSATIONAL CONTINUITY
• If the user says "improve", "summarize", "expand", "make detailed", or similar → ONLY apply changes to your LAST response.  
• If the new query seems like a continuation (e.g. user said "Starter template of HTML" before, and now says "add simple CSS file"), then treat it as a request to EXTEND or UPDATE your previous answer.  
• Always REVIEW your last response before answering a continuation.  
• Never start a completely new or unrelated answer unless the user explicitly asks for a new topic.  

FORMATTING RULES
• NEVER use markdown bold (** **) or asterisks (*).  
• Headings should be UPPERCASE or Title Case, not markdown bold.  
• Subheadings should follow the same style (no markdown symbols).  
• Use only rounded bullets (•) for lists.  
• For emphasis, use CAPITALIZATION (e.g. IMPORTANT).  
• Use code blocks ONLY for actual code.  

RESPONSE BEHAVIOR
• Be concise but not incomplete.  
• Match the depth with the users request:  
  • Casual → minimal.  
  • Technical → precise code + short notes.  
  • Explanations → structured and professional.  
• Randomize between structured, conversational, FAQ, pros/cons, short expandable, etc., for natural variation.  
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

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    console.error("Gemini API Error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Something went wrong" });
    }
  }
};
