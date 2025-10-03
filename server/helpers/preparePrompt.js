import Conversation from "../models/conversation.model.js";
import Chat from "../models/chats.model.js";


export const preparePrompt = async (conversationId, userId, userInput, context) => {
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

  const combinedPrompt = (context ? context + "\n\n" : "") + finalPrompt;
  return { combinedPrompt, conversation };
};