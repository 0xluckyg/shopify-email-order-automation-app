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
        const {page} = ctx.query     
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
        const {page} = ctx.query     
        const limit = 10
        let hasPrevious = true; let hasNext = true
        const headers = getHeaders(accessToken)

        const total = await axios.get(`https://${shop}/admin/api/${version}/orders/count.json`, {
            headers
        })        
        const totalPages = Math.ceil(total.data.count / limit)        
        if (page == totalPages) hasNext = false
        if (page == 1) hasPrevious = false
        const orders = await axios.get(`https://${shop}/admin/api/${version}/orders.json`, {
            headers,
            params: {
                limit,
                page,
            }
        })        

        ctx.body = {orders: orders.data.orders, hasPrevious, hasNext, page}
    } catch (err) {
        console.log('Failed getting orders: ', err)
        ctx.status = 400
    }
}

module.exports = {getOrdersByDay, getOrders}