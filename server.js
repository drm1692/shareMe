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

app.post("/api/files/send", async (req, res) => {

    console.log(req.body);
    return res.send({})
    const { uuid, emialTo, emailFrom} = req.body
    //validate request

    if (!uuid || !emialTo || !emailFrom) {

        return res.status(422).send({ error: "All fields are required except expire" })
    }
    //get data from DB
    try {

        const file = await File.findOne({ uuid: uuid })
        if (file.sender) {

            return res.status(422).send({ error: "Email already send once" })

        }
        file.sender = emailFrom
        file.receiver = emialTo
        const response = await file.save()

        //send email
        const sendMail = require("../services/emailService");
        sendMail({
            from: emailFrom,
            to: emialTo,
            subject: "shareMe file sharing",
            text: `${emailFrom} shared a file with you`,
            html: require("../services/emailTemplate")({

                emailFrom: emailFrom,
                downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}?source=email`,
                size: parseInt(file.size / 100) + "KB",
                expires: "24 hours"
            })
        }).then(() => {

            return res.json({ success: true })
        }).catch(err => {

            return res.status(500).json({ error: 'Error in email sending.' });
        })
        

    } catch(err){
        return res.status(500).send({ error: "something went wrong"})
    }
    
})
//routes
app.use("/api/files", require("./routes/files"))
app.use("/files", require("./routes/show"))
app.use("/files/download", require("./routes/download"))


app.listen(PORT, () => {

    console.log(`listning on port ${PORT}`);
})