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
app.use("/api/v1/dashboard", dashboardRoutes);


app.get("/", (req, res) => {
  res.send("API is running...")
});



app.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
  try {
    const signature = req.headers["safepay-signature"];
    const rawBody = req.body.toString();

    // Verify webhook signature
    const verified = safepayClient.webhooks.verify(rawBody, signature);
    if (!verified) {
      console.error("❌ Invalid Safepay webhook signature");
      return res.status(401).json({ error: "Invalid signature" });
    }

    const event = JSON.parse(rawBody);

    if (event.type === "payment.succeeded") {
      const orderId = event.data.metadata.order_id;
      const amount = event.data.amount;
      const email = event.data.customer_email;

      // Update database (example placeholder)
      console.log(`✅ Payment succeeded for order ${orderId}, amount ${amount}, customer ${email}`);
      // TODO: Update your database to mark order as paid
      // e.g., await database.updateOrder(orderId, { status: "paid", amount, email });
    } else if (event.type === "subscription.created") {
      const subscriptionId = event.data.subscription_id;
      const reference = event.data.metadata.reference;
      console.log(`✅ Subscription created: ${subscriptionId}, reference: ${reference}`);
      // TODO: Update database with subscription details
    }

    res.status(200).send("OK");
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: "Failed to process webhook" });
  }
});



app.get("/verify-payment", async (req, res) => {
  try {
    const { orderId } = req.query;

    // Validate orderId
    if (!orderId) {
      return res.status(400).json({ error: "Missing orderId in query parameters" });
    }

    // Example: Check payment status in database (replace with actual logic)
    const paymentStatus = await database.findPayment(orderId); // Placeholder
    if (!paymentStatus || paymentStatus.status !== "paid") {
      return res.status(400).json({ success: false, message: "Payment not found or not completed" });
    }

    res.json({ success: true, message: "Payment verified!", data: paymentStatus });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ error: "Failed to verify payment" });
  }
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












