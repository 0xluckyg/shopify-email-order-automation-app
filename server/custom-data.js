const axios = require('axios');
const keys = require('../config/keys')
const version = keys.SHOPIFY_API_VERSION
const {User} = require('./db/user');
const URL = require('url');

function getHeaders(accessToken) {
    return {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json',
    }
}

async function getProductUrl(ctx) {
    try {  
        //This header is request header, not festfunnel header (to avoid confusion)
        const {shop, product_id} = ctx.query                
        if (product_id) {
            const user = await User.findOne({shop}, {accessToken: 1})
            const accessToken = user.accessToken
            const headers = getHeaders(accessToken)
            
            const product = await axios.get(`https://${shop}/admin/api/${version}/products/${product_id}.json`, {
                headers
            })
            
            const handle = product.data.product.handle
            // const imageSrc = product.data.product.image.src
            ctx.redirect(`https://${shop}/products/${handle}`)
        } else {
            ctx.status = 400
        }
    } catch(err) {
        console.log('Failed getting products from Shopify: ', err)
        ctx.status = 400
    }
}

async function getProductImageUrl(ctx) {
    try {  
        //This header is request header, not festfunnel header (to avoid confusion)
        const {shop, product_id} = ctx.query                
        if (product_id) {
            const user = await User.findOne({shop}, {accessToken: 1})
            const accessToken = user.accessToken
            const headers = getHeaders(accessToken)
            
            const product = await axios.get(`https://${shop}/admin/api/${version}/products/${product_id}.json`, {
                headers
            })
            
            const imageSrc = product.data.product.image.src
            ctx.redirect(imageSrc)
        } else {
            ctx.status = 400
        }
    } catch(err) {
        console.log('Failed getting products from Shopify: ', err)
        ctx.status = 400
    }
}

module.exports = {getProductUrl, getProductImageUrl}