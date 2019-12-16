const axios = require('axios');
const {User} = require('./db/user');
const {needsUpgradeForSendOrders} = require('./payment/shopify-payment')
const {
    getHeaders, 
    asyncForEach, 
    fetchAllOrdersForDay,
    formatOrders
} = require('./orders-helper')
const { sendEmails } = require('./send-orders')
const keys = require('../config/keys')
const schedule = require('node-schedule');
const moment = require('moment');
const version = keys.SHOPIFY_API_VERSION

function logSend(shop, date, reformattedOrders) {
    const emails = Object.keys(reformattedOrders)
    let emailString = ''
    emails.map(email => {
        emailString += email + ':'
        const customerCount = Object.keys(reformattedOrders[email]).length
        emailString += customerCount + ', '
    })
    
    console.log(`(${date}) Orders for ${shop} to ${emails.length} destinations:\n${emailString}`)
}

//TODO: TEST
async function checkStoreNeedsUpgrade(shop, allOrders) {
    //if user needs to upgrade subscription plan
    const needsUpgrade = await needsUpgradeForSendOrders(shop, allOrders)
    if (needsUpgrade) {
        await User.findOneAndUpdate({shop}, {
            'payment.lock': true
        })
        return true
    } else {
        return false
    }
}

//TODO: TEST
async function getUsers() {
    const users = await User.find({
        'settings.sendMethod.method': 'automatic',
        'gmail.isActive': true,
        active: true
    })
    
    return users
}

async function getShopData(shop, accessToken) {
    const headers = getHeaders(accessToken)
    const shopData = await axios.get(`https://${shop}/admin/api/${version}/shop.json`, {
        headers
    })
    
    return shopData
}

//TODO: TEST
function getShopTimezone(shopData) {
    const shopTimeZoneIANA = shopData.data.shop.iana_timezone
    let today = moment.tz(shopTimeZoneIANA).startOf('day').subtract(1, 'day')   
    //  moment.tz(shopTimeZoneIANA).startOf('day').subtract(1, 'day')    
    console.log('today: ', today.format('YYYY-MM-DD[T]HH:mm:ss'))
    return today.format('YYYY-MM-DD[T]HH:mm:ss')
}

async function sendShopOrder(shop, accessToken) {
    const shopData = await getShopData(shop, accessToken)
            
    console.log('Shop Data: ', shopData.data.shop.iana_timezone)
            
    const today = getShopTimezone(shopData)
    
    let allOrders = await fetchAllOrdersForDay(shop, accessToken, today)
    
    const needsUpgrade = await checkStoreNeedsUpgrade(shop, allOrders)
    if (needsUpgrade) return
    
    const reformattedOrders = await formatOrders(shop, allOrders)
    
    await sendEmails(shop, reformattedOrders, today)
    
    logSend(shop, today, reformattedOrders)
}

async function sendOrdersForShops() {
    const users = await getUsers()
    
    await asyncForEach(users, async (user) => {
        const {shop, accessToken} = user
        if (!shop || !accessToken) return
        try {
            await sendShopOrder(shop, accessToken)
        } catch(err) {
            console.log('Failed cron orders: ', err)
        }
    })
}

//For scheduled send orders per day
async function sendOrdersCron() {
    
    var rule = new schedule.RecurrenceRule();
    rule.hour = 8;
    rule.minute = 0;

    let cronCounter = 0

    schedule.scheduleJob(rule, async () => {  
        console.log('Ran cron: ', new Date())
        if (process.env.NODE_ENV == 'test') return cronCounter++
        
        await sendOrdersForShops()
    })
}

module.exports = {sendOrdersForShops, sendOrdersCron}