//package exposes "shopifyAuth" by default. We're changing that to "createShopifyAuth"
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const {initiatePayment} = require('./shopify-payment');
const {registerAppUninstalled} = require('../webhooks/app-uninstalled');
const {User} = require('../db/user');
//app refers to the Next.js app, which is the react build
const { SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY } = process.env;

//List of Shopify access permissions available
const shopifyScopes = [
    "read_products",
    "write_products",
    "read_product_listings",
    "read_customers",
    "write_customers",
    "read_orders",
    "write_orders",
    "read_draft_orders",
    "write_draft_orders",
    "read_inventory",
    "write_inventory",
    "read_shipping",
    "write_shipping",
    "read_analytics",
    "read_marketing_events",
    "write_marketing_events",
    "read_resource_feedbacks",
    "write_resource_feedbacks",
    "read_shopify_payments_payouts",
    "unauthenticated_read_product_listings",
    "unauthenticated_write_checkouts",
    "unauthenticated_write_customers",
    // "read_all_orders", //Requires approval from Shopify Partners dashboard
    // "read_users", //Only for Shopify Plus
    // "write_users", //Only for Shopify Plus
]

function shopifyAuth() {
    // Returns an authentication middleware taking up (by default) the routes /auth and /auth/callback.
    return createShopifyAuth({
        apiKey: SHOPIFY_API_KEY,
        secret: SHOPIFY_API_SECRET_KEY,
        scopes: shopifyScopes,         
        accessMode: 'offline',   
        //After authenticating with Shopify redirects to this app through afterAuth
        //Async returns promise to wait for Shopify billing fetch to complete
        async afterAuth(ctx) {
            console.log('auth called ', ctx.session)
            const { shop, accessToken } = ctx.session;                   
            //The app will use a library called Shopify App Bridge to communicate with Shopify by passing in Shopify API key to shopOrigin in Polaris AppProvider
            //shopOrigin (shop) is the myshopify URL of the store that installs the app
            //httpOnly: true tells the cookie that the cookie should only be accessible by the server              
            await ctx.cookies.set('shopOrigin', shop, { httpOnly: false })

            //Webhook for detecting when the app unisntalls from the store            
            registerAppUninstalled(shop, accessToken);
            
            const user = await User.findOne({shop})
            let confirmationURL = undefined

            //When user is new to the app
            if (!user) {
                const newUser = new User({
                    shop,
                    accessToken,                            
                    payment: {
                        accepted: false,
                        date: new Date()
                    }
                })
                //When new user subscribes to the app
                const savedUser = await newUser.save()                 
                confirmationURL = await initiatePayment(ctx, savedUser)
                console.log(`${savedUser.shop} user created`)
            
            //When user has installed the app before
            } else {
                //REINSTALL: When payment is not accepted and accessToken is different
                if (user.accessToken !== accessToken) {
                    await User.updateOne({shop}, {$set: {accessToken, "active": true}})                                                                            
                    confirmationURL = await initiatePayment(ctx, user)
                    console.log(`${user.shop} reinstall`)
                //If user didn't finish accepting the payment subscription before. 
                //This step prevents users from not accepting payment, going back to the previous screen, and bypassing the payment step there after
                } else if (user.payment.accepted == false ) {                        
                    confirmationURL = await initiatePayment(ctx, user)
                    console.log(`${user.shop} complete payment process`)                    
                }                         
            }

            //If payment must be initiated again
            if (confirmationURL) {
                ctx.redirect(confirmationURL) 
            //If the user finished the payment process but still triggered shopify auth
            } else {                    
                console.log(`${user.shop} auth pass`)
                ctx.redirect("/");                    
            }                
        },
    })
}

module.exports = shopifyAuth;