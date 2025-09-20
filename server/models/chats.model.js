import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
    prompt: { type: String, required: true },
    response: { type: String, required: true },
    context: { type: String }, 
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);
