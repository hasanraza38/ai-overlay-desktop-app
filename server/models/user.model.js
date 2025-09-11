import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      unique: true,
      sparse: true, // allows null for users without Google login
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
    },
    username: {
      type: String,
      unique: [true, "username already taken"],
      sparse: true, // avoid errors if null
    },
    password: {
      type: String,
      // ⚠️ not required, because Google users won't have passwords
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
    },
    otp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
  
  },
  {
    timestamps: true,
  }
);

// Hash password only if it's set and modified (skip Google accounts)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.model("User", userSchema);
