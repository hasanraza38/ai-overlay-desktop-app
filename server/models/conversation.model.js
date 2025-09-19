import mongoose from "mongoose";


const conversationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true }, 
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", conversationSchema);
