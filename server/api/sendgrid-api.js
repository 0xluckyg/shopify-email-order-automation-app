const sgMail = require('@sendgrid/mail');

// FORMAT OF msg
// {
//     to,
//     from,
//     subject,
//     text: body,
//     html,
//     attachments
// }
// FORMAT OF attachments
// [
//     {
//       content: content,
//       filename: "attachment.pdf",
//       type: "application/pdf",
//       disposition: "attachment"
//     }
// ]

function formatTextToHtmlForSendgrid(text) {
    text = text.replace(new RegExp(`\n`,"g"), '<br>')
    return `<html><body>${text}</body></html>`
}

async function sendEmailUsingSendgrid(msg) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    return new Promise((resolve, reject) => {
        sgMail.send(msg).then(res => {
            resolve(res)
        }).catch(err => {
            if (err) console.log('Failed to send contactUs email using Sendgrid: ', err)
            reject(err)
        });
    })
}

module.exports = {sendEmailUsingSendgrid, formatTextToHtmlForSendgrid}