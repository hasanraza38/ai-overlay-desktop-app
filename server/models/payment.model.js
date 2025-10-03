import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  email: { type: String, required: true },
  amount: { type: Number, required: true },
  plan: { type: String, enum: ["basic", "pro"] }, 
  status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
  updatedAt: { type: Date, default: Date.now },
});

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;