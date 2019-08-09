const axios = require('axios');
const {User} = require('./db/user');
const {ProcessedOrder} = require('./db/processed-order');
const {createOrderText, createSubjectText} = require('../config/template');
const {sendGmail} = require('./auth/gmail-auth');
const {getHeaders, asyncForEach, cleanOrders, combineOrdersAndEmailRules, combineOrdersAndSentHistory} = require('./orders-helper')
const schedule = require('node-schedule');
const moment = require('moment');
const version = '2019-04'

async function sendEmails(shop, emails) {
    try {
        await asyncForEach(Object.keys(emails), async (email) => {
            const emailData = emails[email]
            const user = await User.findOne({shop}, {gmail: 1, settings: 1})
            const {
                headerTemplateText, 
                orderTemplateText, 
                productTemplateText, 
                footerTemplateText, 
                subjectTemplateText
            } = user.settings

            const subjectText = createSubjectText(shop, subjectTemplateText)
            const orderText = createOrderText(
                emailData, 
                shop, 
                headerTemplateText,
                orderTemplateText, 
                productTemplateText,
                footerTemplateText
            )

            //send email through the gmai lapi
            const sent = await sendGmail(                
                user.gmail.googleRefreshToken, 
                email,
                subjectText,
                orderText
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

function createEmailObject(emails, order, item, email) {        
    if (email.sent) return emails    

    if (!emails[email.email]){ 
        emails[email.email] = {}
    }
    
    if (!emails[email.email][order.order_number]){
        emails[email.email][order.order_number] = {
            customer: order.customer,
            shipping_address: order.shipping_address,
            created_at: order.created_at,
            note: order.note,
            id: order.id,
            items: {}
        }
    }

    if (!emails[email.email][order.order_number].items[item.variant_id]) {
        emails[email.email][order.order_number].items[item.variant_id] = item
    } else {                
        emails[email.email][order.order_number].items[item.variant_id][quantity] += 1
    }
    return emails
}

async function reformatOrdersByEmail(orders, date) {
    //  [{
    //     id
    //     shipping_address
    //     customer
    //     line_items [
    //         {
    //             product
    //             emails [
    //                 {email, sent}
    //             ]
    //         }
    //     ]
    // }]

    // FORMAT TO

    // {
    //     email: {
    //         id: {    
    //             shipping_address
    //             customer        
    //             items [
    //                 { product }
    //             ]
    //         }
    //     }
    // }
    // console.log('reform: ', orders.length)
    let emails = {}

    await asyncForEach(orders, async (order) => {
        if (!order.line_items) return
        await asyncForEach(order.line_items, async (item) => {
            await asyncForEach(item.email_rules, async (email) => {
                emails = createEmailObject(emails, order, item, email)
            })
        })
    })
    
    await asyncForEach(Object.keys(emails), async (email) => {
        console.log('email: ', email)
        const tooLong = Object.keys(emails[email]).length
        console.log('toolong: ', tooLong)
        if (tooLong > 2) {
            emails[email] = `${date}.pdf`
        }
    })
    
    return emails
}

function returnStartAndEndDate(date) {
    console.log('START END : ', date)
    if (date) {        
        date = new Date(date)
        let endDate = new Date(date).setDate(date.getDate() + 1)        
        return {
            created_at_min: date.toISOString(),
            created_at_max: new Date(endDate).toISOString()
        }
    } else {
        return {}
    }
}

async function fetchAllOrdersForDay(shop, accessToken, queryDate) {
    try {                
        const limit = 250
        let page = 1; let hasNext = true
        const headers = getHeaders(accessToken)
        const date = returnStartAndEndDate(queryDate)

        const total = await axios.get(`https://${shop}/admin/api/${version}/orders/count.json`, {
            headers,
            params: date
        })
        const totalPages = Math.ceil(total.data.count / limit)

        let allOrders = []
        while (hasNext) {           
            let orders = await axios.get(`https://${shop}/admin/api/${version}/orders.json`, {
                headers,
                params: {
                    limit,
                    page,
                    ...date
                }
            })            
            const callLimitHeader = orders.headers.http_x_shopify_shop_api_call_limit
            const callLimit = parseInt(callLimitHeader.split('/')[0])            
            console.log(`api limit reached: ${callLimitHeader}`)
            if (callLimit > 38) {                
                console.log(`${shop} get order api limit reached: ${callLimitHeader}`)
                const waitFor = delay => new Promise(resolve => setTimeout(resolve, delay));
                await waitFor(2000);
            }

            allOrders = [...allOrders, ...orders.data.orders]
            console.log('page', page)
            if (page == totalPages || totalPages == 0) hasNext = false
            page ++
        }        
        console.log('all: ', allOrders.length)
        return allOrders
    } catch (err) {
        console.log('Failed getting orders: ', err)        
    }
}

async function sendOrders(ctx) {
    try {        
        let allOrders = JSON.parse(ctx.request.rawBody).orders;
        const sent = await sendEmails(ctx.session.shop, allOrders)
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
            let reformattedOrders = await reformatOrdersByEmail(allOrders)
            
            await sendEmails(shop, reformattedOrders)
        })        
    })
}

module.exports = {sendOrders, getAllOrdersForDay, sendOrdersCron}