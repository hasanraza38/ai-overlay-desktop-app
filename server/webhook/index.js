import Payment from "../models/payment.model.js";
import User from "../models/user.model.js";

export const hook = async (req, res) => {
  try {
    console.log("webhook");
    const rawBodyBuffer = req.body;
    const rawBody = rawBodyBuffer.toString("utf8");
    let event;
    try {
      event = JSON.parse(rawBody);
      console.log("Parsed event:", event);
    } catch (err) {
      console.log(`❌ Error parsing JSON: ${err.message}`);
      return res.status(400).send(`Webhook Error: Invalid JSON`);
    }

    if (event.data?.type === "payment:created" && event.data?.notification?.state === "PAID") {
      const payment = event.data.notification;
      const orderId = payment.metadata?.order_id;
      const amount = payment.amount;
      const email = payment.user;

      console.log(`✅ Payment successful: order ${orderId}, amount ${amount}, customer ${email}`);

      let plan = null;
      if (amount === 1000) plan = "basic";
      if (amount === 2000) plan = "pro";

      try {
        let paymentDoc = await Payment.findOneAndUpdate(
          { orderId },
          { amount, email, status: "paid", plan, updatedAt: new Date() },
          { new: true, upsert: true, runValidators: true }
        );

        const user = await User.findOne({ email });
        if (user) {
          user.plan = plan || "basic";
          user.tokensUsedToday = 0; // reset usage
          user.planExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          await user.save();

          paymentDoc.userId = user._id;
          await paymentDoc.save();
        }

        console.log("✅ DB updated: Payment + User upgraded");
      } catch (dbError) {
        console.error("Database error:", dbError);
      }
    } 
    else if (event.data?.type === "payment:failed" || event.data?.type === "charge.disputed") {
      const orderId = event.data?.notification?.metadata?.order_id;
      console.log(`❌ ${event.data?.type} for order ${orderId}`);

      try {
        await Payment.findOneAndUpdate(
          { orderId },
          { status: "failed", updatedAt: new Date() },
          { upsert: true, runValidators: true }
        );
      } catch (dbError) {
        console.error("Database error:", dbError);
      }
    } 
    else {
      console.log("Unhandled event type:", event.data?.type, event.data?.notification?.state);
    }

    res.status(200).send("OK");
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: "Failed to process webhook" });
  }
};
