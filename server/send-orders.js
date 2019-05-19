const axios = require('axios');
const {User} = require('./db/user');
const {ProcessedOrder} = require('./db/processed-order');
const {createOrderText} = require('../config/template')
const {getHeaders, asyncForEach, cleanOrders, combineOrdersAndEmailRules, combineOrdersAndSentHistory} = require('./orders-helper')
const _ = require('lodash')
const version = '2019-04'

async function sendEmails(shop, emails) {
    try {
        await asyncForEach(Object.keys(emails), async (email) => {
            const emailData = emails[email]
            const settings = await User.findOne({shop}, {orderTemplateText: 1, productTemplateText: 1})
            const orderText = createOrderText(
                emailData, 
                shop, 
                settings.orderTemplateText, 
                settings.productTemplateText
            )
            //SEND EMAIL orderText

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

async function reformatOrdersByEmail(orders) {
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
    return emails
}

function returnStartAndEndDate(ctx) {
    let {date} = ctx.query
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

async function fetchAllOrdersForDay(ctx) {
    try {        
        const {shop, accessToken} = ctx.session        
        const limit = 250
        let page = 1; let hasNext = true
        const headers = getHeaders(accessToken)
        const date = returnStartAndEndDate(ctx)

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
        return allOrders
    } catch (err) {
        console.log('Failed getting orders: ', err)        
    }
}


async function sendOneOrder(ctx) {
    let {shop} = ctx.session
    let order = JSON.parse(ctx.request.rawBody).order;
    order = [JSON.parse(body)]
    order = await cleanOrders(order)
    order = await combineOrdersAndEmailRules(shop, order)
    order = await combineOrdersAndSentHistory(order)
        
    let reformattedOrder = await reformatOrdersByEmail(order)

    await sendEmails(ctx.session.shop, reformattedOrder)
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
        const {shop} = ctx.session
        let allOrders = await fetchAllOrdersForDay(ctx)
        allOrders = await cleanOrders(allOrders)
        allOrders = await combineOrdersAndEmailRules(shop, allOrders)
        allOrders = await combineOrdersAndSentHistory(allOrders)
        
        let reformattedOrders = await reformatOrdersByEmail(allOrders)                        
        ctx.body = reformattedOrders
    } catch (err) {
        console.log('Failed getting all orders for day: ', err)
        ctx.status = 400
    }
}

module.exports = {sendOneOrder, sendOrders, getAllOrdersForDay}