const axios = require('axios');
const {User} = require('../db/user');
const {Rule} = require('../db/rule');
const keys = require('../../config/keys')

async function needsUpgradeForSendOrders(shop, orders) {
    const user = await User.findOne({shop}, {payment: 1})
    const plan = user.payment.plan

    //if lowest plan
    if (plan < keys.FEE_1) {
        return (orders.length > 50)
    //if plan 2
    } else if (plan >= keys.FEE_1 && plan < keys.FEE_2) {
        return (orders.length > 300)
    //if highest plan
    } else {
        false
    } 
}

async function needsUpgradeForAddRule(shop) {
    const rules = await Rule.countDocuments({shop})
    const user = await User.findOne({shop}, {payment: 1})
    const plan = user.payment.plan
    
    //if lowest plan
    if (plan < keys.FEE_1) {
        return (rules > 10)
    //if higher than plan 2
    } else {
        return false
    }
}

async function changeSubscription(ctx) {
    try {
        const { shop, accessToken } = ctx.session;    
        const { plan } = ctx.query
        const user = await User.findOne({shop})
        
        const confirmationURL = await initiatePayment(ctx, user, plan)
        ctx.body = confirmationURL
    } catch (err) {
        console.log('Failed change subscription: ', err)
    }
}

//creates a shopify URL that the user will be redirected to to accept payments
function initiatePayment (ctx, user, plan) {            
    const { shop, accessToken } = ctx.session;    
    const freeTrialLeft = calculateTrialDays(user.payment.date, new Date())    
    //Shopify billing API requires 3 variables: price, name, return_url     
    const price = (plan) ? plan : keys.FEE_0
    const stringifiedBillingParams = JSON.stringify({
        recurring_application_charge: {
            name: 'Recurring charge', //The name of your charge. For example, “Sample embedded app 30-day fee.”
            price: `$${price}`,
            return_url: process.env.APP_URL, //URL to return to after user accepts payment
            trial_days: freeTrialLeft, //If merchant doesn't uninstall the app within these days, Shopify charges the merchant
            test: true //The Billing API also has a test property that simulates successful charges.
        }
    })    
    
    const options = {
        credentials: 'include',
        headers: {
            'X-Shopify-Access-Token': accessToken,
            'Content-Type': 'application/json',
        }
    }
    
    return axios.post(
        `https://${shop}/admin/recurring_application_charges.json`, 
        stringifiedBillingParams, 
        options
    )
    .then(res => {
        return res.data.recurring_application_charge.confirmation_url
    })
    .catch(err => {
        console.log('Failed shopify billing request', err)
    })  
}

//subscribes the actual payment to Shopify after user has accepted the payment if there is a charge_id
async function processPayment (ctx, next) {    
    try {
        
        if (!ctx.query.charge_id) return await next();
        
        const chargeId = ctx.query.charge_id;
        const shop = ctx.session.shop;
        const accessToken = ctx.session.accessToken;
        const chargeUrl = 'admin/recurring_application_charges';        
        const options = {
            credentials: 'include',
            headers: {
                'X-Shopify-Access-Token': accessToken,
                'Content-Type': 'application/json',
            },
        };
        
        const res = await axios.get(`https://${shop}/${chargeUrl}/${chargeId}.json`, options)
        const {price, status, updated_at} = res.data.recurring_application_charge
        if (status === 'accepted') { 
            const stringifyData = JSON.stringify(res.data)
            await axios.post(
                `https://${shop}/${chargeUrl}/${chargeId}/activate.json`, 
                stringifyData,
                options
            )
            saveAcceptPayment(shop, price, updated_at)
        }
        
        return ctx.redirect('/')
            
    } catch(err) {
        console.log('Failed processing payment: ', err)   
    }
};

function saveAcceptPayment(shop, price, date) {
    date = new Date(date)
    User.findOneAndUpdate(
        { shop }, 
        { $set: { 
                payment: {
                    lock: false,
                    accepted: true,
                    plan: price,
                    date
                }
            }
        }
    )
    .then(res => {
        return res
    }).catch(err => {
        console.log('Failed saving accepted payment', err)
    })
}

//Shopify does not keep track of how many free trial days are left after app uninstalled.
function calculateTrialDays(a, b) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // a and b are javascript Date objects
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    const dayDifference = Math.floor((utc2 - utc1) / _MS_PER_DAY);
    return (keys.FREE_TRIAL - dayDifference <= 0) ? 0 : (keys.FREE_TRIAL - dayDifference)
}

module.exports = {initiatePayment, processPayment, changeSubscription, needsUpgradeForSendOrders, needsUpgradeForAddRule};