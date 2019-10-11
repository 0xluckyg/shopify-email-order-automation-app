const axios = require('axios');
const keys = require('../config/keys')
const version = keys.SHOPIFY_API_VERSION
const limit = keys.PAGE_SIZE

function getHeaders(accessToken) {
    return {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json',
    }
}

async function getSelectedProducts(selectedProducts, session) {
    try {
        const ids = selectedProducts.join(',')        
        const headers = getHeaders(session.accessToken)
        return await axios.get(`https://${session.shop}/admin/api/${version}/products.json`, {
            headers,
            params: { ids }
        })
    } catch (err) {
        console.log('Failed querySelectedProducts: ', err)
    }
}

async function getProducts(ctx) {
    try {  
        const { shop, accessToken } = ctx.session;
        const headers = getHeaders(accessToken)        
        let hasPrevious = true; let hasNext = true
        let {page, filters, selectedProducts} = ctx.query                
        //For detailed edit history view 
        if (ctx.query.selectedProducts && JSON.parse(selectedProducts).length > 0) {            
            selectedProducts = await getSelectedProducts(JSON.parse(selectedProducts), ctx.session)
            ctx.body = selectedProducts.data;
            return
        }        

        if (filters) filters = JSON.parse(filters)
        const params = {
            ...filters,
            page,
            limit
        }        

        const total = await axios.get(`https://${shop}/admin/api/${version}/products/count.json`, {
            headers,
            params
        })

        const products = await axios.get(`https://${shop}/admin/api/${version}/products.json`, {
            headers,
            params
        })

        const totalPages = Math.ceil(total.data.count / limit)        
        if (page == totalPages || totalPages == 0) hasNext = false
        if (page == 1) hasPrevious = false

        ctx.body = {products: products.data.products, hasPrevious, hasNext, page}
    } catch(err) {
        console.log('Failed getting products from Shopify: ', err)
        ctx.status = 400
    }
}

module.exports = getProducts