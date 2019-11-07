const axios = require('axios');
const {User} = require('./db/user');
const {ProcessedOrder} = require('./db/processed-order');
const {createOrderText, createSubjectText} = require('../helper/template');
const {needsUpgradeForSendOrders} = require('./auth/shopify-payment')
const {getOrderPDF} = require('./pdf')
const {sendGmail, formatAttachment} = require('./auth/gmail-auth');
const {
    getHeaders, 
    asyncForEach, 
    fetchAllOrdersForDay,
    cleanOrders, 
    combineOrdersAndEmailRules, 
    combineOrdersAndSentHistory, 
    reformatOrdersByEmail,
    reduceLongOrders
} = require('./orders-helper')
const keys = require('../config/keys')
const schedule = require('node-schedule');
const moment = require('moment');
const version = keys.SHOPIFY_API_VERSION

async function sendEmails(shop, emails) {
    try {
        const user = await User.findOne({shop}, {
            gmail: 1, settings: 1
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

            //send email through the gmail lapi
            sent = await sendGmail(                
                user.gmail.googleRefreshToken, 
                email,
                subjectText,
                bodyText,
                attachments
            )

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
        
        allOrders = await cleanOrders(allOrders)
        allOrders = await combineOrdersAndEmailRules(shop, allOrders)
        allOrders = await combineOrdersAndSentHistory(allOrders)
        let reformattedOrders = await reformatOrdersByEmail(allOrders)

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
        allOrders = await cleanOrders(allOrders)
        allOrders = await combineOrdersAndEmailRules(shop, allOrders)
        allOrders = await combineOrdersAndSentHistory(allOrders)
        allOrders = await reformatOrdersByEmail(allOrders)
        let reformattedOrders = await reduceLongOrders(shop, allOrders)
        
        ctx.body = reformattedOrders
    } catch (err) {
        console.log('Failed getting all orders for day: ', err)
        ctx.status = 400
    }
}

function logSend(shop, date, reformattedOrders) {
    const emails = Object.keys(reformattedOrders)
    let emailString = ''
    emails.map(email => {
        emailString += email + ':'
        const customerCount = Object.keys(reformattedOrders[email]).length
        emailString += customerCount + ', '
    })
    
    console.log(`
        (${date}) Orders for ${shop} to ${emails.length} destinations:\n
        ${emailString}
    `)
}

//For scheduled send
async function sendOrdersCron() {             
    return schedule.scheduleJob('8 * * *', async () => {  
        const users = await User.find({
            'settings.sendMethod.method': 'automatic',
            'gmail.isActive': true,
            active: true
        })    
        await asyncForEach(users, async (user) => {
            const {shop, accessToken} = user

            const headers = getHeaders(accessToken)
            const shopData = await axios.get(`https://${shop}/admin/api/${version}/shop.json`, {
                headers
            })
        
            if (!shop || !accessToken) return
            const shopTimeZoneIANA = shopData.data.shop.iana_timezone
            let today = moment.tz(shopTimeZoneIANA).startOf('day').subtract(1, 'day')    
            today = today.format('YYYY-MM-DD[T]HH:mm:ss')                
            
            let allOrders = await fetchAllOrdersForDay(shop, accessToken, today)
            
            //if user needs to upgrade subscription plan
            const needsUpgrade = await needsUpgradeForSendOrders(shop, allOrders)
            if (needsUpgrade) {
                await User.findOneAndUpdate({shop}, {
                    'payment.lock': true
                })
                return
            }
            
            allOrders = await cleanOrders(allOrders)
            allOrders = await combineOrdersAndEmailRules(shop, allOrders)
            allOrders = await combineOrdersAndSentHistory(allOrders)    
            let reformattedOrders = await reformatOrdersByEmail(allOrders)
            
            await sendEmails(shop, reformattedOrders, today)
            
            logSend(shop, today, reformattedOrders)
        })        
    })
}

module.exports = {sendOrders, getAllOrdersForDay, sendOrdersCron}