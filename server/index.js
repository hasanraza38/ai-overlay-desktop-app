import express from "express"
import dotenv from "dotenv"
import connectDB from "./controllers/db.js"
dotenv.config()



const app = express()
const port = process.env.PORT || 4000

app.use(express.json())

connectDB()
.then(() => {
     app.listen(port, () => {
        console.log(`⚙️  Server is running at port : ${port}`);
});
})
.catch((err) => {
        console.log("MONGO DB connection failed !!! ", err);
});