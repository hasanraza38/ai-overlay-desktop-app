import safepay from "../config/safepay.js";

 const pay = async (req, res) => {
  try {
    const { amount, orderId, cancelUrl, redirectUrl } = req.body;

    const { token } = await safepay.payments.create({
      amount: amount || 1000, 
      currency: "PKR",
    });

    console.log("Token:", token);

    const url = safepay.checkout.create({
      token,
      orderId: orderId || `SUB-${Date.now()}`, 
      cancelUrl: cancelUrl || "https://www.google.com/",
      redirectUrl: redirectUrl || "http://localhost:4000/success",
      source: "custom",
      webhooks: true,
    });

    console.log("Checkout URL:", url);

    res.json({ url });
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ error: err.message });
  }
};



// import express from "express";
// import Safepay from "safepay"; // official SDK

// const app = express();

// const safepay = new Safepay(process.env.SAFEPAY_API_KEY, {
//   host: process.env.SAFEPAY_ENVIRONMENT === "sandbox"
//     ? "https://sandbox.api.getsafepay.com"
//     : "https://api.getsafepay.com",
//   authType: "secret"
// });

// // Webhook endpoint
// app.post(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   (req, res) => {
//     const signature = req.headers["safepay-signature"];
//     const rawBody = req.body.toString();

//     const verified = safepay.webhooks.verify(rawBody, signature);

//     if (!verified) {
//       console.error("❌ Invalid Safepay webhook signature");
//       return res.status(401).send("Invalid signature");
//     }

//     const event = JSON.parse(rawBody);

//     if (event.type === "payment.succeeded") {
//       const orderId = event.data.metadata.order_id;
//       const amount = event.data.amount;
//       const email = event.data.customer_email;

//       // ✅ update DB: mark order as paid
//       console.log(`✅ Payment succeeded for order ${orderId}, amount ${amount}, customer ${email}`);
//     }

//     res.status(200).send("OK");
//   }
// );


// app.get("/verify-payment", (req, res) => {
//   const valid = safepay.verify.signature(req); // checks sig from query
//   if (!valid) {
//     return res.status(400).json({ success: false, message: "Invalid signature" });
//   }
//   res.json({ success: true, message: "Payment verified!" });
// });



// const pay = async (req, res) =>{

//   safepay.checkout
//   .createSubscription({
//     cancelUrl: 'https://www.google.com/',
//     redirectUrl: 'https://www.google.com/',
//     planId: 'plan_c1789ebf-ba40-4c82-8a7f-b0d92b48f4fd',
//     reference: '001'
//   })
//   .then(url => {
//     console.log(url)
//   })
//   .catch(error => {
//     console.error(error)
//   })
// }


export {
    pay
}



















// // Create checkout (redirect URL)
// const pay = async (req, res) => {
//   try {
//     const { amount, orderId, cancelUrl, redirectUrl } = req.body;

//     // Step 1: Create payment token
//     const { token } = await safepay.payments.create({
//       amount: amount || 1000,
//       currency: "PKR",
//     });

//     console.log("✅ Token created:", token);

//     // Step 2: Create checkout URL
//     const url = safepay.checkout.create({
//       token,
//       orderId: orderId || `SUB-${Date.now()}`,
//       cancelUrl: cancelUrl || "http://localhost:3000/cancel",
//       redirectUrl: redirectUrl || "http://localhost:4000/success",
//       source: "custom",
//       webhooks: true,
//     });

//     console.log("✅ Checkout URL:", url);

//     res.json({ url });
//   } catch (err) {
//     console.error("❌ Checkout error:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

// // Webhook endpoint (server → server)
// const webhook = (req, res) => {
//   const signature = req.headers["safepay-signature"];
//   const rawBody = req.body.toString();

//   const verified = safepay.webhooks.verify(rawBody, signature);

//   if (!verified) {
//     console.error("❌ Invalid webhook signature");
//     return res.status(401).send("Invalid signature");
//   }

//   const event = JSON.parse(rawBody);

//   if (event.type === "payment.succeeded") {
//     const { order_id } = event.data.metadata;
//     const { amount, customer_email } = event.data;

//     // ✅ Update DB here
//     console.log(`✅ Payment succeeded for ${order_id}, amount: ${amount}, customer: ${customer_email}`);
//   }

//   res.status(200).send("OK");
// };

// // Verify redirect (optional client-side)
// // const verifyPayment = (req, res) => {
// //   const valid = safepay.verify.signature(req);
// //   if (!valid) {
// //     return res.status(400).json({ success: false, message: "Invalid signature" });
// //   }
// //   res.json({ success: true, message: "Payment verified!" });
// // };



// const verifyPayment = (req, res) => {
//   try {
//     const { order_id, tracker, sig } = req.query;

//     if (!order_id || !tracker || !sig) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing required parameters",
//       });
//     }

//     // Verify using Safepay SDK
//     const isValid = safepay.verify.signature(req.query);

//     if (!isValid) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid signature",
//       });
//     }

//     // ✅ At this point, payment is verified
//     res.json({
//       success: true,
//       message: "Payment verified successfully",
//       order_id,
//       tracker,
//     });
//   } catch (error) {
//     console.error("Verification error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };

// export { pay, webhook, verifyPayment };
