// Shopify Partners Login
// https://partners.shopify.com
// For development use ngrok tunneling 
// ~/ngrok http 3000
// If ngrok pro option
// ~/ngrok http 3000 -subdomain=scottshopify
// https://scottshopify.ngrok.io
// URLs to whitelist on Partners dashboard
// App URL: https://scottshopify.ngrok.io/
// Whitelisted Redirection: https://scottshopify.ngrok.io/auth/callback, https://scottshopify.ngrok.io/auth
// To Run App
// {forwarding address}/shopify?shop={shop name}.myshopify.com
// https://scottshopify.ngrok.io/auth?shop=miraekomerco.myshopify.com

// next.js takes care of:
// webpack configuration
// hot module replacement
// server-side rendering
// production setup
// client-side routing
// updating babel configuration
// code splitting

// koa uses async/await. Using the original promises will not work

require('isomorphic-fetch');
require('./config/config');
require('./server/db/mongoose'); //If using DB
//koa and koa-session will take care of Shopify OAuth and create a custom server
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const session = require('koa-session');
//package exposes "shopifyAuth" by default. We're changing that to "createShopifyAuth"
const { verifyRequest } = require('@shopify/koa-shopify-auth');
const next = require('next');

const {processPayment} = require('./server/auth/shopify-payment');
const getUser = require('./server/get-user');
const contactUs = require('./server/contact-us');
const shopifyAuth = require('./server/auth/shopify-auth');
const {appUninstalled} = require('./server/webhooks/app-uninstalled');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
//app refers to the Next.js app, which is the react build
const app = next({ dev });
const handle = app.getRequestHandler();
const { SHOPIFY_API_SECRET_KEY } = process.env;

//Prepare next.js react app
app.prepare().then(() => {

    //Koa acts like "app" in express
    const server = new Koa();    
    const router = new Router();
    server.keys = [SHOPIFY_API_SECRET_KEY];

    server.use(bodyParser());      
    server.use(session(server));
    server.use(shopifyAuth());
    //Returns a middleware to verify requests before letting the app further in the chain.
    //Everything after this point will require authentication        
    //authRoute: '/foo/auth' (Path to redirect to if verification fails. defaults to '/auth')        
    //fallbackRoute: '/install' (Path to redirect to if verification fails and there is no shop on the query. defaults to '/auth')
    server.use(verifyRequest());                      

    router.get('/', processPayment);    
    router.get('/get-user', getUser);    
    router.post('/contact-us', contactUs)
    //validates webhook and listens for products/create in the store
    router.post('/webhooks/app/uninstalled', bodyParser(), appUninstalled)

    server.use(router.routes());      
    //Lets next.js prepare all the requests on the React side
    server.use(async (ctx) => {        
        await handle(ctx.req, ctx.res);
        ctx.respond = false;
        ctx.res.statusCode = 200;        
        return
    });   

    server.listen(port, () => {
        console.log(`Running on port: ${port}`);
    });
});