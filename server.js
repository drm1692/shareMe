const express = require('express')
const connectDB = require('./config/db')
const app = express()
const path = require("path")
const cors = require("cors")

const PORT = process.env.PORT || 3000
app.use(express.static("public"))
app.use(express.json())

const connectDb = require("./config/db")
connectDB()

//cors setup
// const corsOptions = {

//     origin: process.env.ALLOWED_CLIENTS
// }
app.use(cors())
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