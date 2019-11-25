const {needsUpgradeForSendOrders} = require('./auth/shopify-payment')
const {
    fetchAllOrdersForDay,
    formatOrders,
    markLongOrdersAsPdf,
    sendEmails
} = require('./orders-helper')

async function sendOrders(ctx) {
    try {
        const {shop, accessToken} = ctx.session
        const {date} = JSON.parse(ctx.request.rawBody)

        let allOrders = await fetchAllOrdersForDay(shop, accessToken, date)
        
        //if user needs to upgrade subscription plan
        const needsUpgrade = await needsUpgradeForSendOrders(shop, allOrders)
        if (needsUpgrade) {
            ctx.status = 400
            ctx.body = 'needs upgrade'
            return
        }
        
        const reformattedOrders = await formatOrders(shop, allOrders)

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
        allOrders = await formatOrders(shop, allOrders)
        let reformattedOrders = await markLongOrdersAsPdf(shop, allOrders)
        
        ctx.body = reformattedOrders
    } catch (err) {
        console.log('Failed getting all orders for day: ', err)
        ctx.status = 400
    }
}

module.exports = {sendOrders, getAllOrdersForDay, sendEmails}