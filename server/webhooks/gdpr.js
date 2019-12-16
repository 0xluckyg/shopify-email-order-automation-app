const {validateWebhook} = require('./index');
const User = require('../db/user')
const sgMail = require('@sendgrid/mail');

async function deleteUserData(shop) {
    try {
        const redactUser = await User.findOne({shop})
        let conservedPaymentInfo = redactUser.payment
        conservedPaymentInfo.accepted = false
        const newUser = new User({
            shop,
            payment: conservedPaymentInfo
        })
        
        await User.findOneAndDelete({shop})
        await newUser.save()

    } catch(err) {
        console.log('Failed deleteUserData during webhook: ', err)
    }
}

async function getUserData(shop) {
    try {
        const getUser = await User.findOne({shop}, {
            accessToken: 0,
            "gmail.googleRefreshToken": 0,
        })
        
        return getUser
    } catch(err) {
        console.log('Failed getUserData during webhook: ', err)
    }
}

async function sendEmail(shop, to, subject, body) {
    try {
        const bodyText = 'Shop: ' + shop + '\n\n' + body

        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to,
            from: process.env.APP_EMAIL,
            subject,
            text: bodyText
        };
        sgMail.send(msg).catch(err => {
            if (err) console.log('Failed to send contactUs email using Sendgrid: ', err)
        });
        
    } catch(err) {
        console.log('Failed sendEmails for webhooks: ',err)
    }
}

//MAIN GDPR FUNCTIONS
async function dataRequest(ctx) {
    try {
        if (!validateWebhook(ctx)) return
        
        const body = ctx.request.rawBody;   
        
        const {shopifyDomain, customer} = JSON.parse(body)
        if (!shopifyDomain) return
        
        const userData = getUserData(shopifyDomain)

        if (customer.email) {
            const stringData = JSON.stringify(userData)
            await sendEmail(
                shopifyDomain, 
                customer.email, 
                'Shopify GDRP Requested Data',
                stringData
            )      
        }

        ctx.status = 200
        ctx.body = userData
        return
        
    } catch(err) {
        console.log('Failed dataRequest webhook: ', err)
    }
}

async function customerRedact(ctx) {
    try {
        if (!validateWebhook(ctx)) return
        
        const body = ctx.request.rawBody;
        
        const {shopifyDomain, customer} = JSON.parse(body)
        if (!shopifyDomain) return

        await deleteUserData(shopifyDomain)

        ctx.status = 200
        ctx.body = 'customer deleted'
        return
        
    } catch(err) {
        console.log('Failed customerRedact webhook: ', err)
    }
}

async function shopRedact(ctx) {
    try {
        if (!validateWebhook(ctx)) return
        
        const body = ctx.request.rawBody;
        
        const shopifyDomain = JSON.parse(body).myshopify_domain
        if (!shopifyDomain) return

        await deleteUserData(shopifyDomain)

        ctx.status = 200
        ctx.body = 'shop deleted'
        return 
        
    } catch(err) {
        console.log('Failed shopRedact webhook: ', err)
    }
}

module.exports = {dataRequest, customerRedact, shopRedact}