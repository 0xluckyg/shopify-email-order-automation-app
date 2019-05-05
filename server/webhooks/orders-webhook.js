const validateWebhook = require('./validate-webhook');
const {Order} = require('../db/order');
const {Product} = require('../db/product');
const {User} = require('../db/user');

//We send a post request to Shopify upon authentication, to tell Shopify to notify us through webhook when app uninstall happens.
function registerOrderWebhook(shop, accessToken) {
    //Subscribing to webhook event 'products/create'
    //In a production app, you would need to store the webhook in a database to access the response on the frontend.
    const stringifiedWebhookParams = JSON.stringify({
        webhook: {
            topic: 'orders/create',
            address: `${process.env.APP_URL}/webhooks/orders/create`,
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
            console.log('orders/create webhook created: ', shop)
        })
        .catch((error) => console.log('Failed creating webhook: ', error));
}

//We put this function in POST webhook/app/uninstalled on our server, and Shopify notifies this endpoint everytime app uninstall triggers
function orderPlaced(ctx) {
    const validated = validateWebhook(ctx)
    
    if (validated) {
        const body = ctx.request.rawBody;   
        console.log('orders/create webhook response: ',body)
        const shopifyDomain = JSON.parse(body).myshopify_domain
        if (shopifyDomain) {
            console.log('order placed: ', body)
        }
    }
}

module.exports = {orderPlaced, registerOrderWebhook}