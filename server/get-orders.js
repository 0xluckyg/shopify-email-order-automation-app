const axios = require('axios');
const version = '2019-04'

function getHeaders(accessToken) {
    return {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json',
    }
}

async function getOrdersByDay(ctx) {               
    try {        
        const {shop, accessToken} = ctx.session
        const {page, date} = ctx.query     
        const limit = 10
        let hasPrevious = true; let hasNext = true
        const headers = getHeaders(accessToken)

        const total = await axios.get(`https://${shop}/admin/api/${version}/orders/count.json`, {
            headers
            // params: {                
            //     created_at_min:
            //     created_at_max:
            // }
        })        
        const totalPages = Math.ceil(total.data.count / limit)        
        if (page == totalPages) hasNext = false
        if (page == 1) hasPrevious = false
        const orders = await axios.get(`https://${shop}/admin/api/${version}/orders.json`, {
            headers,
            params: {
                limit,
                page,                          
                // created_at_min:
                // created_at_max:            
            }
        })

        ctx.body = {orders: orders.data, hasPrevious, hasNext, page}
    } catch (err) {
        console.log('Failed getting orders: ', err)
        ctx.status = 400
    }
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
            console.log('date1: ', date)
            console.log('date2: ', new Date(endDate))
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

        const orders = await axios.get(`https://${shop}/admin/api/${version}/orders.json`, {
            headers,
            params: {
                limit,
                page,
                ...date
            }
        })        
        console.log('total: ', totalPages)
        console.log('orders: ', orders.data.orders.length)

        ctx.body = {orders: orders.data.orders, hasPrevious, hasNext, page}
    } catch (err) {
        console.log('Failed getting orders: ', err)
        ctx.status = 400
    }
}

module.exports = {getOrdersByDay, getOrders}