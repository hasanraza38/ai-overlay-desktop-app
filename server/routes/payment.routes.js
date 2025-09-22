import express from 'express';
import { pay } from '../controllers/payment.controller.js';

const router = express.Router();

router.post("/checkout", pay)

export default router;
