const {validateWebhook} = require('./index');

//We put this function in POST webhook/app/uninstalled on our server, and Shopify notifies this endpoint everytime app uninstall triggers
async function appUninstalled(ctx) {
    const validated = validateWebhook(ctx)
    
    if (validated) {
        
    }
}

module.exports = {appUninstalled}