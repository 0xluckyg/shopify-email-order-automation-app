const {sendEmailUsingSendgrid} = require('./api/sendgrid-api')
const sgMail = require('@sendgrid/mail');

async function contactUs(ctx) {
    
    try {
        const shop = ctx.session.shop       
        const body = JSON.parse(ctx.request.rawBody)
    
        //Ads the shop domain as part of the body text to identify which store the message was sent from
        const bodyText = 'Shop: ' + shop + '\n\n' + 'App: ' + process.env.APP_URL + '\n\n' + body.body
    
        const msg = {
            to: process.env.APP_EMAIL,
            from: body.email,
            subject: body.subject,
            text: bodyText,
        };
        await sendEmailUsingSendgrid(msg)
        ctx.body = 'success'
    } catch(err) {
        console.log('Failed to send contactUs email: ', err)
        ctx.status = 400   
    }
}

module.exports = contactUs