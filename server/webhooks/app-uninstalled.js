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
    const webhookOptions = {
        method: 'POST',
        body: stringifiedWebhookParams,
        credentials: 'include',
        headers: {
            'X-Shopify-Access-Token': accessToken,
            'Content-Type': 'application/json',
        },
    };
    //Registers the webhook to shopify through a post request                
    fetch(`https://${shop}/admin/webhooks.json`, webhookOptions)
        .then((response) => {                         
            return response.json()
        })
        .then(() => {
            console.log('app/uninstalled webhook created')            
        })
        .catch((error) => console.log('Failed creating app/uninstalled webhook', error));
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