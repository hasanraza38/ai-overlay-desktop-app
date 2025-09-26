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


dotenv.config()
const app = express()
const port = process.env.PORT || 4000

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json())
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


app.use('/api/v1/auth', authRoutes);
app.use("/api/v1/chatbot", chatbotRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/dasboard", dashboardRoutes);


app.get("/", (req, res) => {
  res.send("API is running...")
});



connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running at port : ${port}`);
    });
  })
  .catch((err) => {
    console.log("MONGO DB connection failed !!! ", err);
  });












