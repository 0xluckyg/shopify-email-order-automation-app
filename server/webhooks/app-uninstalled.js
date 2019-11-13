const {validateWebhook} = require('./index');
const {User} = require('../db/user');

//We put this function in POST webhook/app/uninstalled on our server, and Shopify notifies this endpoint everytime app uninstall triggers
async function appUninstalled(ctx) {
    try {
        if (!validateWebhook(ctx)) return
        
        const body = ctx.request.rawBody;   
        const shopifyDomain = JSON.parse(body).myshopify_domain
        if (shopifyDomain) {
            await unregisterUser(shopifyDomain);
            ctx.status = 200
            ctx.body = 'app uninstalled'
        } 
    } catch(err) {
        console.log('Failed appUninstalled webhook: ', err)
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

module.exports = {appUninstalled}