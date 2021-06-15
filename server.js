require("dotenv").config()
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const path = require("path")
const cors = require("cors")


app.use(express.static("public"))
app.use(express.json())


const connectDB = require("./config/db")
connectDB()

//cors setup
const corsOptions = {

    "origin": "*",
    "methods": "GET,POST,HEAD,PUT,PATCH,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}
app.use(cors(corsOptions))

//template engine
app.set("views", path.join(__dirname, "/views"))
app.set("view engine", "ejs")


//routes
app.use("/api/files", require("./routes/files"))
app.use("/files", require("./routes/show"))
app.use("/files/download", require("./routes/download"))

app.listen(PORT, () => {

    console.log(`listning on port ${PORT}`);
})