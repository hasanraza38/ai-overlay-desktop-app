import express from "express"
import passport from 'passport';
import session from 'express-session';
import connectDB from "./config/db.js";
import dotenv from "dotenv"
import authRoutes from './routes/auth.routes.js';
import './config/passport.js'; 
import './config/db.js';   
import morgan from "morgan";
import helmet from "helmet";


dotenv.config()
const app = express()
const port = process.env.PORT || 4000
const JWT_SECRET = process.env.JWT_SECRET;

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json())
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);






connectDB()
.then(() => {
     app.listen(port, () => {
        console.log(`⚙️  Server is running at port : ${port}`);
});
})
.catch((err) => {
        console.log("MONGO DB connection failed !!! ", err);
});

















