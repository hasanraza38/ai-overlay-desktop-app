import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { generateToken } from "../utils/jwt.js";
import crypto from "crypto"
import { sendOTPEmail, sendWelcomeEmail } from "../utils/mail.js";



const registerUser = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    if (!email) return res.status(400).json({ message: "Email required" });
    if (!name) return res.status(400).json({ message: "Name required" });
    if (!password) return res.status(400).json({ message: "Password required" });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already registered with this email" });
    }

    const createUser = await User.create({
      email,
      name,
      password,
    });

    sendWelcomeEmail(createUser.email, createUser.name);

    const token = generateToken(createUser);

    res.status(201).json({
      message: "User registered successfully",
      user: createUser,
      token,
    });
  } catch (error) {
    console.error("Register error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    const safeUser = user.toObject();
    delete safeUser.password;
    delete safeUser.otp;
    delete safeUser.otpExpires;

    return res.json({
      message: "User logged in",
      role: user.role,
      user: safeUser,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const googleCallback = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    if (user.isNewUser) {
      sendWelcomeEmail(user.email, user.name);
    }

    const token = generateToken(user);

    return res.json({
      message: "Google login successful",
      role: user.role,
      user,
      token,
    });
  } catch (error) {
    console.error("Google callback error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};


const sendOTP = async (req, res) => {

  try {
     const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });


  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  user.otp = hashedOtp;
  user.otpExpires = Date.now() + 10 * 60 * 1000;
  await user.save();

  await sendOTPEmail(email, otp);

  res.status(200).json({ message: "OTP sent to email" });
    
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
 
};




const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    const user = await User.findOne({
      email,
      otp: hashedOtp,
      otpExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.status(200).json({ message: "OTP verified" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    const user = await User.findOne({
      email,
      otp: hashedOtp,
      otpExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = newPassword;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};




export { registerUser, login, googleCallback, sendOTP, verifyOTP, resetPassword };
