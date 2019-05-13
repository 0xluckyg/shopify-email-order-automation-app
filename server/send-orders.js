const axios = require('axios');
const {getHeaders, asyncForEach, cleanOrders, combineOrdersAndEmailRules, combineOrdersAndSentHistory} = require('./orders-helper')
const _ = require('lodash')
const version = '2019-04'

function createEmailMap(emails, order, item, email) {    
    if (!emails.has(email.email)){ 
        emails.set(email.email, new Map())
    }
    
    if (!emails.get(email.email).has(order.id)){
        emails.get(email.email).set(order.id, {
            customer: order.customer,
            shipping_address: order.shipping_address,
            items: new Map()
        })
    }

    if (!emails.get(email.email).get(order.id).items.has(item.variant_id)) {
        emails.get(email.email).get(order.id).items.set(item.variant_id, item)
    } else {
        let newCount = emails.get(email.email).get(order.id).items.get(item.variant_id)
        newCount.quantity += 1
        emails.get(email.email).get(order.id).items.set(item.variant_id, newCount)
    }

    return emails
}

function reformatOrdersByEmail(orders) {
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
    let emails = new Map()

    await asyncForEach(orders, async (order, i) => {
        if (!order.line_items) return
        await asyncForEach(order.line_items, async (item) => {
            await asyncForEach(item.email_rules, async (email) => {
                emails = createEmailMap(emails, order, item, email)
            })
        })
    })
    
}

async function getAllOrdersForDay(ctx) {
    try {        
        const {shop, accessToken} = ctx.session
        let {date} = ctx.query
        const limit = 10
        let page = 1; let hasNext = true
        const headers = getHeaders(accessToken)
        
        if (date) {            
            date = new Date(date)          
            let endDate = new Date(date).setDate(date.getDate() + 1)
                        
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
            allOrders = [...allOrders, ...orders]
            if (page == totalPages || totalPages == 0) hasNext = false
        }

        ctx.body = {orders, hasPrevious, hasNext, page}
    } catch (err) {
        console.log('Failed getting orders: ', err)
        ctx.status = 400
    }
}


function sendOneOrder(ctx) {

}

function sendDayOrders(ctx) {
    let allOrders = await getAllOrdersForDay(ctx)
    allOrders = await cleanOrders(orders.data.orders)
    allOrders = await combineOrdersAndEmailRules(shop, orders)
    allOrders = await combineOrdersAndSentHistory(orders)
 
    reformattedOrders = await reformatOrdersByEmail(allOrders)
}

module.exports = {sendOneOrder, sendDayOrders}