const axios = require('axios');
const version = '2019-04'
const limit = 10

function getHeaders(accessToken) {
    return {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json',
    }
}

async function getSelectedProducts(selectedProducts, session) {
    try {
        ids = selectedProducts.join(',')        
        const headers = getHeaders(session.accessToken)
        return await axios.get(`https://${session.shop}/admin/api/${version}/products.json`, {
            headers,
            params: { ids }
        })
    } catch (err) {
        console.log('Failed querySelectedProducts: ', err)
    }
}

function convertFiltersIntoParams(filters) {
    filters = JSON.parse(filters) 
    params = {}
    filters.forEach(filter => {
        let {key, value} = filter
        params[key] = value
    })
    return params
}

async function getProducts(ctx) {        
    try {  
        const { shop, accessToken } = ctx.session;
        const headers = getHeaders(accessToken)        
        let hasPrevious = true; let hasNext = true
        let {page, filters, selectedProducts} = ctx.query        

        console.log('selected: ', selectedProducts)

        //For detailed edit history view 
        if (ctx.query.selectedProducts && JSON.parse(selectedProducts).length > 0) {            
            selectedProducts = await getSelectedProducts(JSON.parse(selectedProducts), ctx.session)
            ctx.body = selectedProducts.data;
            return
        }

        console.log('filters: ', filters)

        let params = convertFiltersIntoParams(filters)
        params = {
            ...params,
            page,
            limit
        }

        console.log('params: ', params)

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

        console.log('products: ', products.data.products.length)

        ctx.body = {products: products.data.products, hasPrevious, hasNext, page}
    } catch(err) {
        console.log('Failed getting products from Shopify: ', err)
        ctx.status = 400
    }
}

module.exports = getProducts