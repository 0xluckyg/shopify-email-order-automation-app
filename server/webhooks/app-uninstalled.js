const axios = require('axios');
const validateWebhook = require('./validate-webhook');
const {User} = require('../db/user');

//We send a post request to Shopify upon authentication, to tell Shopify to notify us through webhook when app uninstall happens.
function registerAppUninstalled(shop, accessToken) {
        //Subscribing to webhook event 'products/create'
    //In a production app, you would need to store the webhook in a database to access the response on the frontend.
    const stringifiedWebhookParams = JSON.stringify({
        webhook: {
            topic: 'app/uninstalled',
            address: `${process.env.APP_URL}/webhooks/app/uninstalled`,
            format: 'json',
        },
    });
    
    const options = {
        credentials: 'include',
        headers: {
            'X-Shopify-Access-Token': accessToken,
            'Content-Type': 'application/json',
        }
    }
    
    axios.post(
        `https://${shop}/admin/webhooks.json`, 
        stringifiedWebhookParams, 
        options
    ).then(res => {
        return res
    }).catch(err => {
        return err
    })
}

//We put this function in POST webhook/app/uninstalled on our server, and Shopify notifies this endpoint everytime app uninstall triggers
async function appUninstalled(ctx) {
    const validated = validateWebhook(ctx)
    
    if (validated) {
        const body = ctx.request.rawBody;   
        const shopifyDomain = JSON.parse(body).myshopify_domain
        if (shopifyDomain) {
            await unregisterUser(shopifyDomain);
            ctx.status = 200
            ctx.body = 'app uninstalled'
        } 
    }
}

//Shopify automatically stops subscription when user uninstalls. Set active and payment status to false in our db.
async function unregisterUser(shop) {
    try {
        return await User.findOneAndUpdate(
            { shop }, 
            { $set: { "active": false, "payment.accepted": false } }
        )
    } catch (err) {
        console.log('Failed saving declined payment', err)
    }
}

module.exports = {registerAppUninstalled, appUninstalled}