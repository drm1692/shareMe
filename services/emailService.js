const nodemailer = require("nodemailer")

async function sendMail ({ from, to, subject, text, html}) {

    let transporter = nodemailer.createTransport({

        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.ND4VfxdMG2COjs65

            
        }
    })
    let mailOptions = {

        from : `shareMe <${from}>`,
        to: to,
        subject: subject,
        text: text,
        html: html 
    }

    transporter.sendMail(mailOptions, function(err, data){

        if(err){
            console.log("error occured", err);
        }
        else{
            console.log("success");
        }
    })
}

module.exports = sendMail;
