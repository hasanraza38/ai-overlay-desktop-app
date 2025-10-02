import express from "express"
import passport from 'passport';
import session from 'express-session';
import connectDB from "./config/db.js";
import dotenv from "dotenv"
import authRoutes from './routes/auth.routes.js';
import chatbotRoutes from './routes/chatbot.route.js';
import paymentRoutes from './routes/payment.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import './config/passport.js';
import './config/db.js';
import morgan from "morgan";
import helmet from "helmet";
import { hook } from "./webhook/index.js";

dotenv.config()
const app = express()
const port = process.env.PORT || 4000

app.use(helmet());
app.use(morgan("dev"));
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


app.use('/api/v1/auth', express.json(), authRoutes);
app.use("/api/v1/chatbot", express.json(), chatbotRoutes);
app.use("/api/v1/payment", express.json(), paymentRoutes);
app.use("/api/v1/dashboard", express.json(), dashboardRoutes);


app.get("/", (req, res) => {
  res.send("API is running...")
});
app.get("/success", (req, res) => {
  const { orderId } = req.query;
  res.json({ message: "Payment redirected, verify with /verify-payment", orderId });
});

app.post("/webhook", express.raw({ type: "application/json" }), hook );



connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running at port : ${port}`);
    });
  })
  .catch((err) => {
    console.log("MONGO DB connection failed !!! ", err);
  });






