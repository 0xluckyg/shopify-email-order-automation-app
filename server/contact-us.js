// https://stackoverflow.com/questions/31516821/node-js-email-doesnt-get-sent-with-gmail-smtp
// Allow less secure apps  https://myaccount.google.com/lesssecureapps
// Allow display unlock catch option  https://accounts.google.com/DisplayUnlockCaptcha

const nodemailer = require('nodemailer');

async function contactUs(ctx) {
    const shop = ctx.session.shop       
    const body = JSON.parse(ctx.request.rawBody)

    //Ads the shop domain as part of the body text to identify which store the message was sent from
    const bodyText = 'Shop: ' + shop + '\n\n' + body.body

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.APP_EMAIL,
            pass: process.env.APP_EMAIL_PW
        }
    });

    const mailOptions = {
        from: body.email,
        to: process.env.APP_EMAIL,
        subject: body.subject,
        text: bodyText
    };

    const error = await transporter.sendMail(mailOptions, function(error, info){
        if (error) return error
    });

    // ctx.body can not be set inside a Promise. Only async / await
    if (error) {
        ctx.status = 400
    } else {
        ctx.body = ''
    }
}

module.exports = contactUs