const {User} = require('../db/user');
const {Rule} = require('../db/rule');
const keys = require('../../config/keys')

async function needsUpgradeForSendOrders(shop, orders) {
    const user = await User.findOne({shop}, {payment: 1})
    const plan = user.payment.plan

    //if lowest plan
    if (plan <= keys.FEE_0) {
        return (orders.length > 50)
    //if plan 2
    } else if (plan > keys.FEE_0 && plan <= keys.FEE_1) {
        return (orders.length > 300)
    //if highest plan
    } else if (plan >= keys.FEE_2) {
        false
    } 
}

async function needsUpgradeForAddRule(shop) {
    const rules = await Rule.countDocuments({shop})
    const user = await User.findOne({shop}, {payment: 1})
    const plan = user.payment.plan
    
    console.log('p: ', plan)
    console.log('r: ', rules)
    console.log('k: ', keys.FEE_0)
    //if lowest plan
    if (plan <= keys.FEE_0) {
        return (rules > 10)
    //if higher than plan 2
    } else if (plan >= keys.FEE_1) {
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
        method: 'POST',
        body: stringifiedBillingParams,
        credentials: 'include',
        headers: {
            'X-Shopify-Access-Token': accessToken,
            'Content-Type': 'application/json',
        },
    };
    //Make Shopify billing request using await
    return fetch(`https://${shop}/admin/recurring_application_charges.json`, options)
        .then((response) => {                        
            return response.json()
        })
        .then(async (jsonData) => {            
            return jsonData.recurring_application_charge.confirmation_url                                                 
        })
        .catch((error) => console.log('error', error));     
}

//subscribes the actual payment to Shopify after user has accepted the payment if there is a charge_id
async function processPayment (ctx, next) {    
    if (ctx.query.charge_id) {
        console.log('process payment called');    
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
        const optionsWithGet = { ...options, method: 'GET' };
        const optionsWithPost = { ...options, method: 'POST' }

        fetch(`https://${shop}/${chargeUrl}/${chargeId}.json`,
        optionsWithGet,)
            .then((response) => response.json())
            .then((myJson) => {
                const {price, status, updated_at} = myJson.recurring_application_charge
                if (status === 'accepted') {
                    const stringifyMyJSON = JSON.stringify(myJson)
                    const optionsWithJSON = { ...optionsWithPost, body: stringifyMyJSON }
                    fetch(`https://${shop}/${chargeUrl}/${chargeId}/activate.json`, optionsWithJSON)
                    //set payment status to true in our db after Shopify receives payment subscription
                    .then(() => {
                        saveAcceptPayment(shop, price, updated_at)
                    })
                    .catch((error) => console.log('Failed processing payment: ', error));
                }
                else return ctx.redirect('/')
            });

        return ctx.redirect('/');
    } else {
        await next();
    }
};

function saveAcceptPayment(shop, price, date) {
    date = new Date(date)
    User.findOneAndUpdate(
        { shop }, 
        { $set: { 
                payment: {
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
        console.log('error saving accepted payment', err)
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