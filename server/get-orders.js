const axios = require('axios');
const {Rule} = require('./db/rule')
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

async function findRulesAndCompare(shop, orders) {
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
                    compareProductIds(item, rule)) {
                    
                    console.log('title: ', item.title)    
                    console.log('filter: ', rule.filters)
                    console.log('email: ', rule.email)

                    //put send all emails to by day page
                    array[i].line_items[j].email_rules.push({email: rule.email, sent: false})
                }
            })
        })
    })
    return orders
}

function findEmailHistoryAndCompare(orders) {
    
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

        orders = await findRulesAndCompare(shop, orders.data.orders)

        ctx.body = {orders, hasPrevious, hasNext, page}
    } catch (err) {
        console.log('Failed getting orders: ', err)
        ctx.status = 400
    }
}

module.exports = {getOrders}