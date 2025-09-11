import express from "express"
import connectDB from "./controllers/db.js"
import passport from 'passport';
import session from 'express-session';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv"
dotenv.config()



const app = express()
const port = process.env.PORT || 4000
const JWT_SECRET = process.env.JWT_SECRET;

app.use(express.json())

passport.use(new GoogleStrategy({
    clientID: "YOUR_GOOGLE_CLIENT_ID",
    clientSecret: "YOUR_GOOGLE_CLIENT_SECRET",
    callbackURL: "http://localhost:3000/api/auth/google/callback",
  },
  async (accessToken, refreshToken, profile, done) => {
    // Here, check if user exists in your DB, if not create
    const user = {
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value
    };
    done(null, user);
  }
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.use(session({ secret: "keyboard cat", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());



// Trigger Google login
app.get('/api/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback URL after login
app.get('/api/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Issue your own JWT
    const token = jwt.sign({ userId: req.user.googleId, name: req.user.name }, JWT_SECRET, { expiresIn: '1h' });
    
    // Send token to Electron frontend
    res.json({ token, user: req.user });
  }
);





connectDB()
.then(() => {
     app.listen(port, () => {
        console.log(`⚙️  Server is running at port : ${port}`);
});
})
.catch((err) => {
        console.log("MONGO DB connection failed !!! ", err);
});