const {needsUpgradeForSendOrders} = require('./payment/shopify-payment')
const {
    fetchAllOrdersForDay,
    formatOrders,
    asyncForEach
} = require('./orders-helper')
const {
    markLongOrdersAsPdf
} = require('./pdf')
const {User} = require('./db/user');
const {ProcessedOrder} = require('./db/processed-order')
const _ = require('lodash')
const {createOrderText, createSubjectText} = require('../helper/template');
const {getPDFName, getOrderPDF} = require('./pdf')
const {sendGmail, formatAttachment} = require('./api/gmail-api');
const {sendEmailUsingSendgrid, formatTextToHtmlForSendgrid} = require('./api/sendgrid-api');

async function sendOrder(ctx) {
    
}

async function sendEmails(shop, emails) {
    try {
        const user = await User.findOne({shop}, {
            gmail: 1, settings: 1, email: 1
        })
        const {
            headerTemplateText, 
            orderTemplateText, 
            productTemplateText, 
            footerTemplateText, 
            subjectTemplateText,
            PDFSettings
        } = user.settings

        await asyncForEach(Object.keys(emails), async (email) => {
            const emailData = emails[email]
            const {PDFOrderLimit} = PDFSettings
            const tooLong = Object.keys(emailData).length
            let sent = false
            const subjectText = createSubjectText(shop, subjectTemplateText)
            let bodyText = ''
            let attachments = []
            if (tooLong >= PDFOrderLimit) {
                bodyText = 'Please see the attached PDF for orders.'
                const {pdfName, pdfBase64} = await getOrderPDF(shop, emailData)
                attachments.push(formatAttachment(pdfName, pdfBase64))
            } else {
                bodyText = createOrderText(
                    emailData, 
                    shop, 
                    headerTemplateText,
                    orderTemplateText,
                    productTemplateText,
                    footerTemplateText
                )
            }
            
            if (!user.email) throw 'User email does not exist on sendEmails'

            sent = await sendEmailUsingSendgrid({
                to: email,
                from: user.email,
                subject: subjectText,
                html: formatTextToHtmlForSendgrid(bodyText),
                attachments
            })
            
            if (user.settings.selfEmailCopy) {
                sent = await sendEmailUsingSendgrid({
                    to: user.email,
                    from: process.env.APP_EMAIL,
                    subject: 'Receipt: '+subjectText,
                    html: formatTextToHtmlForSendgrid(`The following email has been sent to: ${email}\n\n` + bodyText),
                    attachments
                })
            }

            // send email through the gmail lapi
            // sent = await sendGmail(                
            //     user.gmail.googleRefreshToken, 
            //     {   
            //         to: email,
            //         subject: subjectText,
            //         body: bodyText,
            //         attachments
            //     } 
            // )

            if (!sent) return            

            let processedOrders = []        
            await asyncForEach(Object.keys(emailData), async (orderNumber) => {                  
                const order = emailData[orderNumber]             
                await asyncForEach(Object.keys(order.items), async (itemId) => {
                    const product = order.items[itemId]
                    let processedOrder = {}

                    processedOrder.shop = shop
                    processedOrder.email = email
                    processedOrder.order_id = order.id
                    processedOrder.order_number = orderNumber
                    processedOrder.order_date = new Date(order.created_at)
                    processedOrder.title = product.title
                    processedOrder.product_id = product.product_id
                    processedOrder.variant_id = product.variant_id                    

                    processedOrders.push(processedOrder)
                })
            })

            await ProcessedOrder.insertMany(processedOrders)
        })

        return true
    } catch (err) {
        console.log('Failed sending emails: ', err)
        return false
    }
}

async function sendOrders(ctx) {
    try {
        const {shop, accessToken} = ctx.session
        const {date} = JSON.parse(ctx.request.rawBody)
        let allOrders = await fetchAllOrdersForDay(shop, accessToken, date)

        //if user needs to upgrade subscription plan
        const needsUpgrade = await needsUpgradeForSendOrders(shop, allOrders)
        if (needsUpgrade) {
            ctx.status = 400
            ctx.body = 'needs upgrade'
            return
        }
        
        const reformattedOrders = await formatOrders(shop, allOrders)

        const sent = await sendEmails(shop, reformattedOrders, date)
        ctx.status = 200
        ctx.body = sent
    } catch (err) {
        console.log('Failed sending all orders for day: ', err)
        ctx.status = 400
    }
}

//For previewing send
async function getAllOrdersForDay(ctx) {
    try {
        const {shop, accessToken} = ctx.session
        const {date} = ctx.query

        let allOrders = await fetchAllOrdersForDay(shop, accessToken, date)
        allOrders = await formatOrders(shop, allOrders)
        let reformattedOrders = await markLongOrdersAsPdf(shop, allOrders)
        
        ctx.body = reformattedOrders
    } catch (err) {
        console.log('Failed getting all orders for day: ', err)
        ctx.status = 400
    }
}

module.exports = {sendOrders, getAllOrdersForDay, sendEmails}