import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { type } from "os";

// const userSchema = new mongoose.Schema(
//   {
//     googleId: {
//       type: String,
//       unique: true,
//       sparse: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     name: {
//       type: String,
//     },

//     password: {
//       type: String,
//     },
//     avatar: {
//       type: String,
//     },
//     role: {
//       type: String,
//       default: "user",
//     },
//     otp: {
//       type: String,
//     },
//     otpExpires: {
//       type: Date,
//     },
//     isNewUser: {
//       type: Boolean,
//       default: true,
//     }

//   },
//   {
//     timestamps: true,
//   }
// );


const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, unique: true, sparse: true },
    email: { type: String, required: true, unique: true },
    name: { type: String },
    password: { type: String },
    avatar: { type: String },
    role: { type: String, default: "user" },
    otp: { type: String },
    otpExpires: { type: Date },
    isNewUser: { type: Boolean, default: true },

    plan: {
      type: String,
      enum: ["free", "basic", "pro"],
      default: "free",
    },
    tokensUsedToday: {
      type: Number,
      default: 0,
    },
    tokenResetAt: {
      type: Date,
    },
    planExpiresAt: {
      type: Date, 
    }
  },
  { timestamps: true }
);


userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.model("User", userSchema);
