import express from "express"
import dotenv from "dotenv"
dotenv.config()



const app = express()
const port = process.env.PORT || 4000

app.use(express.json())


app.get("/", (req, res) => {
    res.status(200).send("API is running...")
})
app.listen(port, () => {
    console.log(`⚙️  Server is running at port : ${port}`);
});

