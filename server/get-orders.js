const axios = require('axios');
const version = '2019-04'

async function getOrdersByDay(ctx) {               
    try {        
        const {shop, accessToken} = ctx.session        
        const {date, cursor} = ctx.query
        const headers = {
            'X-Shopify-Access-Token': accessToken,
            'Content-Type': 'application/json',
        }
        const total = await axios.get(`https://${shop}/admin/api/${version}/orders/count.json`, {
            headers,
            // params: {                
                // created_at_min:
                // created_at_max:
            // }
        })
        const orders = await axios.get(`https://${shop}/admin/api/${version}/orders.json`, {
            headers,
            params: {
                limit: 10,
                since_id: cursor,
                created_at_min: date,
                created_at_max: date
            }
        })

        console.log('ORDerS: ',orders)

        ctx.body = {orders: orders.data, total: total.data}
    } catch (err) {
        console.log('Failed getting orders: ', err)
        ctx.status = 400
    }
}

async function getOrders(ctx) {
    try {
        const {shop, accessToken} = ctx.session
        const {cursor} = ctx.query           
        const headers = {
            'X-Shopify-Access-Token': accessToken,
            'Content-Type': 'application/json',
        }
        const total = await axios.get(`https://${shop}/admin/api/${version}/orders/count.json`, {
            headers,
            // params: {                
            //     created_at_min:
            //     created_at_max:
            // }
        })
        const orders = await axios.get(`https://${shop}/admin/api/${version}/orders.json`, {
            headers,
            params: {
                limit: 250,
                since_id: cursor
            }
        })
        
        console.log('ORDerS: ',orders)

        ctx.body = {orders: orders.data, total: total.data}
    } catch (err) {
        console.log('Failed getting orders: ', err)
        ctx.status = 400
    }
}

module.exports = {getOrdersByDay, getOrders}