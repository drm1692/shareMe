const router = require("express").Router()
const multer = require("multer")
const path = require("path")
const File = require("../models/file")
const {v4: uuid4 } = require("uuid")
const { response } = require("express")
const { send } = require("process")

let storage = multer.diskStorage({

    destination: (req,file,cb) => cb(null, "uploads/"),
    filename: (req,file,cb) => {

        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName)
    }
})

let upload = multer({

    storage,
    limit: { fileSize: 1000000 * 100}
}).single("file")

router.post("/", (req, res) => {

    //store files

        upload(req, res, async (err) => {

        //validate request

        if(!req.file){

            return res.json({error : "all fields are required."})
        }

        if(err){

            return res.status(500).send({ error: err.msg})
        }

    //store in DB
        const file = new File({

            filename: req.file.filename,
            uuid: uuid4(),
            path: req.file.path,
            size: req.file.size
        })

    const ressponse = await file.save()
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    return response.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}`})
    //http://localhost:3000/files/25153dkkkdj-2354psknejj

    })
   
})
router.post("/send", async (req,res) => {

    const {uuid, emialTo, emailFrom} = req.body
    //validate request

    if(!uuid || !emialTo || !emailFrom){

        return res.status(422).send({ error: "All fields are required"})
    }
    //get data from DB
    const file = await File.findOne({ uuid: uuid})
    if(file.sender){

        return res.status(422).send({ error: "Email already send"})
 
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
        html:  require("../services/emailTemplate")({

            emailFrom: emailFrom,
            downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size: parseInt(file.size/100) + "KB",
            expires: "24 hours"
        })
    })
    return res.send({ success: true})
})
module.exports = router