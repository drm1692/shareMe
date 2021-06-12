const router = require("express").Router()
const multer = require("multer")
const path = require("path")
const File = require("../models/file")
const { v4: uuidv4 } = require("uuid")
// const { response } = require("express")
// const { send } = require("process")

let storage = multer.diskStorage({

    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => {

        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName)
    }
})

let upload = multer({

    storage,
    limits: { fileSize: 1000000 * 100 },
}).single("myfile")

router.post("", (req, res) => {

    //store files

    upload(req, res, async (err) => {

        //validate request

        // if(!req.file){

        //     return res.json({error : "file does not uploaded."})
        // }

        if (err) {

            return res.status(500).send({ error: err.message })
        }

        //store in DB
        const file = new File({

            filename: req.file.filename,
            uuid: uuidv4(),
            path: req.file.path,
            size: req.file.size
            
        })

        const response = await file.save()
        //res.setHeader('Access-Control-Allow-Credentials', 'true')
        res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` })
        //http://localhost:3000/files/25153dkkkdj-2354psknejj

    })

})
router.post("/send", async (req, res) => {

    const { uuid, emialTo, emailFrom, expiresIn } = req.body
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
        const sendMail = require("../services/emailService")
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
module.exports = router