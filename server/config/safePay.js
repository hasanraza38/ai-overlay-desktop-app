import { Safepay } from "@sfpy/node-sdk";

export const safepay = new Safepay({
  environment: process.env.SAFEPAY_ENVIRONMENT,
  apiKey: process.env.SAFEPAY_API_KEY,
  v1Secret: process.env.SAFEPAY_SECRET,
  webhookSecret:process.env.SAFEPAY_WEBHOOK_SECRET
})
