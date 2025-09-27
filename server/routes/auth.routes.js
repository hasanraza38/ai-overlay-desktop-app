import express from 'express';
import passport from 'passport';
import { googleCallback, login, registerUser, resetPassword, sendOTP, verifyOTP } from '../controllers/auth.controllers.js';


const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  googleCallback
);

router.post('/login', login);
router.post('/register', registerUser);
router.post("/sendotp", sendOTP);
router.post("/verifyotp", verifyOTP);
router.post("/resetpassword", resetPassword);

export default router;
