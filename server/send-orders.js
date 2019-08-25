const axios = require('axios');
const {User} = require('./db/user');
const {ProcessedOrder} = require('./db/processed-order');
const {createOrderText, createSubjectText} = require('../helper/template');
const {getOrderPDF} = require('./pdf')
const {sendGmail, formatAttachment} = require('./auth/gmail-auth');
const {getHeaders, 
    asyncForEach, 
    fetchAllOrdersForDay,
    cleanOrders, 
    combineOrdersAndEmailRules, 
    combineOrdersAndSentHistory, 
    reformatOrdersByEmail,
} = require('./orders-helper')
const schedule = require('node-schedule');
const moment = require('moment');
const version = '2019-04'

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
            subjectTemplateText
        } = user.settings

        await asyncForEach(Object.keys(emails), async (email) => {
            const emailData = emails[email]

            const tooLong = Object.keys(emailData).length
            let sent = false
            const subjectText = createSubjectText(shop, subjectTemplateText)
            let bodyText = ''
            let attachments = []
            if (tooLong > 2) {
                bodyText = 'Please see the attached PDF for orders.'
                const {pdfName, pdfBase64} = await getOrderPDF(null, emailData)
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
                    processedOrder.order_id = order.id;
                    processedOrder.order_number = orderNumber
                    processedOrder.order_date = new Date(order.created_at)
                    processedOrder.title = product.title
                    processedOrder.product_id = product.product_id
                    processedOrder.variant_id = product.variant_id                    

                    processedOrders.push(processedOrder)
                })
            })

            console.log('processed: ', processedOrders.length)

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
        allOrders = await cleanOrders(allOrders)
        allOrders = await combineOrdersAndEmailRules(shop, allOrders)
        allOrders = await combineOrdersAndSentHistory(allOrders)
        let reformattedOrders = await reformatOrdersByEmail(allOrders, date, true)

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
        let reformattedOrders = await reformatOrdersByEmail(allOrders, date)
        console.log('reformattedOrders: ', reformattedOrders)
        
        ctx.body = reformattedOrders
    } catch (err) {
        console.log('Failed getting all orders for day: ', err)
        ctx.status = 400
    }
}

//For scheduled send
async function sendOrdersCron() {             
    return schedule.scheduleJob('8 * * *', async () => {        
        const users = await User.find({
            'settings.sendMethod.method': 'manual',
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
            allOrders = await cleanOrders(allOrders)
            allOrders = await combineOrdersAndEmailRules(shop, allOrders)
            allOrders = await combineOrdersAndSentHistory(allOrders)    
            let reformattedOrders = await reformatOrdersByEmail(allOrders, today, true)
            
            await sendEmails(shop, reformattedOrders, today)
        })        
    })
}

module.exports = {sendOrders, getAllOrdersForDay, sendOrdersCron}