const axios = require('axios');
const {Rule} = require('./db/rule')
const {ProcessedOrder} = require('./db/processed-order')
const _ = require('lodash')
const version = '2019-04'

function getHeaders(accessToken) {
    return {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json',
    }
}

async function asyncForEach(array, callback) {    
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

async function cleanOrders(orders) {    
    await asyncForEach(orders, async (order, i, array) => {        
        if (!order.customer || !order.shipping_address || !order.line_items) return 
        array[i] = _.pick(order, ["id", "total_price", "currency", "processed_at", "order_number", "customer", "line_items", "shipping_address"])
        array[i].customer = _.pick(order.customer, ["email", "first_name", "last_name", "phone", "orders_count", "total_spent"])
        array[i].shipping_address = _.pick(order.shipping_address, ["address1", "address2", "city", "company", "country", "province", "province_code", "zip"])        
        await asyncForEach(order.line_items, (item, j) => {            
            array[i].line_items[j] = _.pick(item, ["variant_id", "product_id", "title", "quantity", "sku", "price", "variant_title", "vendor"])
        })
    })
    return orders
}

function compareVendors(item, rule) {
    return ((rule.filters.vendor && item.vendor) && 
    (rule.filters.vendor.toUpperCase() == item.vendor.toUpperCase())) ?
    true : false    
}

function compareTitles(item, rule) {
    return ((item.title && rule.filters.title) && 
    (item.title.toUpperCase().includes(rule.filters.title.toUpperCase()))) ?
    true : false    
}

function compareProductIds(item, rule) {
    return ((rule.selectedProducts && item.product_id) && 
    (rule.selectedProducts.includes(item.product_id))) ?
    true : false    
}

function ruleIncludesAllProducts(rule, filters) {
    return (rule.selectedProducts.length < 0 
        && !filters.title 
        && !filters.vendor) ? true : false
}

async function combineOrdersAndEmailRules(shop, orders) {
    const rules = await Rule.find({shop})
    await asyncForEach(orders, async (order, i, array) => {
        if (!order.line_items) return
        await asyncForEach(order.line_items, async (item, j) => {

            //initiating email rules to the orders result to each product in the order
            if (!array[i].line_items[j].email_rules) { 
                array[i].line_items[j].email_rules = []
            }

            await asyncForEach(rules, async rule => {
                //check for if product matches vendor, title, product_id


                if (compareTitles(item, rule) || 
                    compareVendors(item, rule) || 
                    compareProductIds(item, rule) || 
                    ruleIncludesAllProducts(rule, filters)) {
                    
                    // console.log('title: ', item.title)    
                    // console.log('filter: ', rule.filters)
                    // console.log('email: ', rule.email)

                    //put send all emails to by day page
                    array[i].line_items[j].email_rules.push({email: rule.email, sent: false})
                }
            })
        })
    })
    return orders
}

async function getProcessedEmails(orders) {
    const orderIds = []
    await asyncForEach(orders, async (order) => {
        orderIds.push(order.id)
    })
    return await ProcessedOrder.find({
        'order_id': { $in: orderIds }
    })
}

async function combineOrdersAndSentHistory(orders) { 
    //If order matches -> if product id matches & if email matches
    const processedEmails = await getProcessedEmails(orders)
    await asyncForEach(orders, async (order, i, array) => {
        if (!order.line_items) return
        await asyncForEach(order.line_items, async (item, j) => {
            await asyncForEach(processedEmails, async (processed) => {
                item.emails.forEach((email, k) => {
                    // product_id and email have to match if the email has already been processed
                    if (processed.product_id == item.product_id && 
                        processed.email == email) {
                        array[i].line_items[j].email_rules[k].sent = true
                    }
                })
            })                      
        })
    })
    return orders
}

async function getOrders(ctx) {
    try {        
        const {shop, accessToken} = ctx.session
        let {page, date} = ctx.query     
        const limit = 10
        let hasPrevious = true; let hasNext = true
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
        if (page == totalPages || totalPages == 0) hasNext = false
        if (page == 1) hasPrevious = false

        let orders = await axios.get(`https://${shop}/admin/api/${version}/orders.json`, {
            headers,
            params: {
                limit,
                page,
                ...date
            }
        })
        console.log('total: ', totalPages)
        console.log('orders: ', orders.data.orders.length)
        
        orders = await cleanOrders(orders.data.orders)
        orders = await combineOrdersAndEmailRules(shop, orders)
        orders = await combineOrdersAndSentHistory(orders)        

        ctx.body = {orders, hasPrevious, hasNext, page}
    } catch (err) {
        console.log('Failed getting orders: ', err)
        ctx.status = 400
    }
}

module.exports = {getOrders}