import { safepay } from "../config/safepay.js";

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
      redirectUrl: redirectUrl || "https://www.google.com/",
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