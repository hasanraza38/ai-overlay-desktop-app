import Payment from "../models/payment.model";

export const hook = async (req, res) => {
  try {
    console.log("webhook");
    const rawBodyBuffer = req.body;
    console.log("Webhook hit! Raw Body Buffer:", rawBodyBuffer);

    // Convert buffer to string for JSON parsing
    const rawBody = rawBodyBuffer.toString("utf8");
    let event;
    try { 
      event = JSON.parse(rawBody);
      console.log("Parsed event:", event);
    } catch (err) {
      console.log(`❌ Error parsing JSON: ${err.message}`);
      return res.status(400).send(`Webhook Error: Invalid JSON`);
    }

    // Handle different event types based on the nested structure
    if (event.data?.type === "payment:created" && event.data?.notification?.state === "PAID") {
      const payment = event.data.notification;
      const orderId = payment.metadata?.order_id;
      const amount = payment.amount;
      const email = payment.user;

      console.log(`✅ Payment created and paid for order ${orderId}, amount ${amount}, customer ${email}`);

      // Database operation: Update or create payment record
      try {
        let paymentDoc = await Payment.findOneAndUpdate(
          { orderId },
          { amount, email, status: "paid", updatedAt: new Date() },
          { new: true, upsert: true, runValidators: true }
        );
        console.log("Database updated:", paymentDoc);
      } catch (dbError) {
        console.error("Database error:", dbError);
      }
    } else if (event.data?.type === "payment:failed" || event.data?.type === "charge.disputed") {
      const errorData = event.data;
      console.log(`❌ ${event.data?.type.replace(":", " ")}:`, errorData);
      try {
        await Payment.findOneAndUpdate(
          { orderId: event.data?.notification?.metadata?.order_id },
          { status: "failed", updatedAt: new Date() },
          { upsert: true, runValidators: true }
        );
      } catch (dbError) {
        console.error("Database error:", dbError);
      }
    } else {
      console.log("Unhandled event type or state:", event.data?.type, event.data?.notification?.state);
    }

    res.status(200).send("OK");
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: "Failed to process webhook" });
  }
}