import express from 'express';
import { pay } from '../controllers/payment.controller.js';

const router = express.Router();

router.post("/checkout", pay)

export default router;







// import express from "express";
// import { pay, webhook } from "../controllers/payment.controller.js";

// const router = express.Router();

// router.post("/checkout", pay);
// router.post("/webhook", express.raw({ type: "application/json" }), webhook);

// export default router;
