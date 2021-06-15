const nodemailer = require("nodemailer")

function sendMail ({ from, to, subject, text, html}) {

    let transporter = nodemailer.createTransport({

        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
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
