import nodemailer from "nodemailer";
import { generateEmailTemplate } from "./mailTemplate.js";



const sendOTPEmail = async (to, otp) => {
  try {

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    })
    const html = generateEmailTemplate("otp", { otp });

    await transporter.sendMail({
      from: `"Ai-Overlay - Team" <${process.env.EMAIL}>`,
      to: `${to}, 92hasanraza689@gmail.com`,
      subject: "Your OTP for Password Reset",
      html,
    });
  } catch (err) {
    console.error("OTP email error:", err);
  }
};



const sendWelcomeEmail = async (to, name) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });
    const html = generateEmailTemplate("welcome", { name });

    await transporter.sendMail({
      from: `"Ai-Overlay - Team" <${process.env.EMAIL}>`,
      to: `${to}, 92hasanraza689@gmail.com`,
      subject: "Welcome to Ai-Overlay!",
      html,
    });
  } catch (err) {
    console.error("Welcome email error:", err);
  }
};



export { sendOTPEmail, sendWelcomeEmail };