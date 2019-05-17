const axios = require('axios');
const {User} = require('./db/user');
const {ProcessedOrder} = require('./db/processed-order');
const {getHeaders, asyncForEach, cleanOrders, combineOrdersAndEmailRules, combineOrdersAndSentHistory} = require('./orders-helper')
const _ = require('lodash')
const version = '2019-04'

async function sendEmails(shop, emails) {
    try {

        Object.keys(emails).map(email => {
            const emailData = emails[email]
            const settings = await User.findOne({shop}, {templateText: 1, productTemplateText: 1})
            const orderText = createOrderText(
                emailData, 
                shop, 
                settings.templateText, 
                settings.productTemplateText
            )
            //SEND EMAIL orderText

            let processedOrders = []        
            Object.keys(emailData).map(orderId => {            
                const order = emailData[orderId]                        
                Object.keys(order.items).map(itemId => {
                    const product = order.items[itemId]
                    let processedOrder = {}

                    processedOrder.shop = shop
                    processedOrder.email = email
                    processedOrder.order_number = order.order_number
                    processedOrder.order_id = orderId
                    processedOrder.order_date = order.processed_at
                    processedOrder.title = product.title
                    processedOrder.product_id = product.product_id
                    processedOrder.variant_id = product.variant_id

                    processedOrders.push(processedOrder)
                })
            })            

            await ProcessedOrder.insertMany(processedOrders)
        })

    } catch (err) {
        console.log('Failed sending emails: ', err)
    }
}

function createEmailObject(emails, order, item, email) {    
    if (item.email_rules && item.email_rules.sent) return emails

    if (!emails[email.email]){ 
        emails[email.email] = {}
    }
    
    if (!emails[email.email][order.order_number]){
        emails[email.email][order.order_number] = {
            customer: order.customer,
            shipping_address: order.shipping_address,
            processed_at: order.processed_at,
            note: order.note,
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

async function fetchAllOrdersForDay(ctx) {
    try {        
        const {shop, accessToken} = ctx.session
        let {date} = ctx.query
        const limit = 10
        let page = 1; let hasNext = true
        const headers = getHeaders(accessToken)
        
        if (date) {
            console.log('date: ', date)
            date = new Date(date)
            let endDate = new Date(date).setDate(date.getDate() + 1)
            console.log('enddate: ', endDate)
            date = {
                created_at_min: date.toISOString(),
                created_at_max: new Date(endDate).toISOString()
            }
        } else {
            date = {}
        }

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
            console.log('api limit: ',orders.headers.http_x_shopify_shop_api_call_limit)            
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


function sendOneOrder(ctx) {
    let order = ctx.request.rawBody;                      
    order = [JSON.parse(body)]
    order = await cleanOrders(order)
    order = await combineOrdersAndEmailRules(ctx.session.shop, order)
    order = await combineOrdersAndSentHistory(order)
        
    let reformattedOrder = await reformatOrdersByEmail(order)

    await sendEmails(ctx.session.shop, reformattedOrder)
}

async function sendAllOrdersForDay(ctx) {
    try {
        let allOrders = await fetchAllOrdersForDay(ctx)
        allOrders = await cleanOrders(allOrders)
        allOrders = await combineOrdersAndEmailRules(ctx.session.shop, allOrders)
        allOrders = await combineOrdersAndSentHistory(allOrders)
            
        let reformattedOrders = await reformatOrdersByEmail(allOrders)

        await sendEmails(ctx.session.shop, reformattedOrders)

    } catch (err) {
        console.log('Failed sending all orders for day: ', err)
        ctx.status = 400
    }    
}

//For previewing send
async function getAllOrdersForDay(ctx) {
    try {
        let allOrders = await fetchAllOrdersForDay(ctx)
        allOrders = await cleanOrders(allOrders)
        allOrders = await combineOrdersAndEmailRules(ctx.session.shop, allOrders)
        allOrders = await combineOrdersAndSentHistory(allOrders)
        
        let reformattedOrders = await reformatOrdersByEmail(allOrders)                        
        ctx.body = reformattedOrders
    } catch (err) {
        console.log('Failed getting all orders for day: ', err)
        ctx.status = 400
    }
}

module.exports = {sendOneOrder, sendAllOrdersForDay, getAllOrdersForDay}