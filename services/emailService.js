const nodemailer = require("nodemailer")

async function sendMail ({ from, to, subject, text, html}) {

    let transporter = nodemailer.createTransport({

        host: "smtp-relay.sendinblue.com",
        port: 587,
        secure: false,
        auth: {
            user: "majithiyadivya@gmail.com",
            pass: "ND4VfxdMG2COjs65"

            
        }
    })
    let info = await transporter.sendMail({

        from : `shareMe <${from}>`,
        to,
        subject,
        text,
        html 
    })
}

module.exports = sendMail;
