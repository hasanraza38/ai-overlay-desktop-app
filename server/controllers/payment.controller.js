import safepay from "../config/safepayconfig.js";

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



export {
    pay
}
