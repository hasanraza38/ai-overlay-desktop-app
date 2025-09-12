import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { generateToken } from "../utils/jwt.js";

const registerUser = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    if (!email) return res.status(400).json({ message: "Email required" });
    if (!name) return res.status(400).json({ message: "Name required" });

    if (!password) {
      return res
        .status(400)
        .json({ message: "Password required" });
    }

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

    let user;

    if (!password) {
      return res
        .status(400)
        .json({ message: "Password is required" });
    }

    user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  

    const token = generateForeverToken(user);

    return res.json({
      message: "User logged in",
      role: user.role,
      user,
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

    const token = generateForeverToken(user);

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

export { registerUser, login, googleCallback };
