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
// app.use((req,res,next) => {

//     res.header('Access-Control-Allow-Origin','*')
//     res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE')
//     res.header('Access-Control-Allow-Headers','Content-Type')
//     next()
// })
// const corsOptions = {

//     origin: "http://127.0.0.1:3000",
//     credentials: true
// }
app.options("*",cors())

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