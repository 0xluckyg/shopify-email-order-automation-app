const axios = require('axios')
require('../../config/config');
const crypto = require('crypto');
const safeCompare = require('safe-compare');
const {SHOPIFY_API_SECRET_KEY} = process.env;

//We send a post request to Shopify upon authentication, to tell Shopify to notify us through webhook when app uninstall happens.
async function registerWebhook(shop, accessToken, webhookId) {
    //webhookId example: app/uninstalled
    //ex: Subscribing to webhook event 'products/create'

    const stringifiedWebhookParams = JSON.stringify({
        webhook: {
            topic: webhookId,
            address: `${process.env.APP_URL}/webhooks/${webhookId}`,
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
    
    await axios.post(
        `https://${shop}/admin/webhooks.json`, 
        stringifiedWebhookParams, 
        options
    ).then(res => {
        return res
    }).catch(err => {
        return err
    })
}

function validateWebhook(ctx) {    
    const hmacHeader = ctx.get('X-Shopify-Hmac-Sha256');    
    //Json response is stored in ctx.request.rawBody
    const body = ctx.request.rawBody;    
    const generatedHash = crypto
        .createHmac('sha256', SHOPIFY_API_SECRET_KEY)
        .update(body, 'utf8', 'hex')
        .digest('base64');    
    
    if (safeCompare(generatedHash, hmacHeader)) {          
        ctx.res.statusCode = 200;        
        return true;
    } else {                
        ctx.res.statusCode = 403;
        return false;
    }
}

module.exports = {registerWebhook, validateWebhook}