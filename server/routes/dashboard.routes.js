// routes/userRoutes.js
import express from "express";
import { getUser } from "../controllers/dashboard.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/user", authenticate, getUser );

export default router;