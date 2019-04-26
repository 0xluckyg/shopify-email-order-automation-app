// Webhook notification contains a JSON payload, and HTTP headers that provide context
// X-Shopify-Topic: orders/create
// X-Shopify-Hmac-Sha256: XWmrwMey6OsLMeiZKwP4FppHH3cmAiiJJAweH5Jo4bM=
// X-Shopify-Shop-Domain: johns-apparel.myshopify.com

require('../../config/config');
const crypto = require('crypto');
const safeCompare = require('safe-compare');

const {SHOPIFY_API_SECRET_KEY} = process.env;
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
module.exports = validateWebhook;