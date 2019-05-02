// https://help.shopify.com/en/api/getting-started/search-syntax
// Comparators = "< > <= >="
    // : is equality*
    // :< is less-than
    // :> is greater-than
    // :<= is less-than-or-equal-to
    // :>= is greater-than-or-equal-to
// Connective = "AND" "OR" 
    // When a Connective is not specified between two Terms, AND is implied.
    // query=first_name:Bob age:27
    // This will search for the "Bob" in the "first_name" field AND "27" in the "age" field.
// Modifier = "NOT" followed by white space
    // query=NOT bob
// Exclamation mark "!" in front of a graphql value means it's non nullable
// Common graphql types: String, Boolean, DateTime, UnsignedInt64
// Can send null for variables if there is no value
// For shopify pagination, user cursor

const {GraphQLClient} = require('graphql-request')

function makeQueryString(arr) {
    let queryString = ''
    if (arr.length == 0) return queryString
    for (i = 0; i < arr.length; i ++) {        
        queryString = queryString + arr[i].key + ':' + arr[i].value
        if (i != arr.length - 1) {
            queryString = queryString + ' OR '
        }
    }
    return queryString
}

async function querySelectedProducts(selectedProducts, client) {
    const query = `query($ids: [ID!]!) {
        nodes(ids:$ids) {
            ...on Product {
                id
                title
                handle
                productType
                vendor        
                tags
                onlineStoreUrl
                onlineStorePreviewUrl
                featuredImage {
                    originalSrc
                } 
            }
        }
    }`
    const variables = {
        ids: selectedProducts        
    }    
    try {
        const res = await client.request(query, variables)
        // result => { "data": { "nodes": [ { "id": String, "description": String} ] } }        
        return res.nodes
    } catch (err) {
        console.log('Failed querySelectedProducts: ', err)
    }
}

async function getProducts(ctx) {          
    const { shop, accessToken } = ctx.session;        

    const uri = `https://${shop}/admin/api/graphql.json`       
    const client = new GraphQLClient(uri, {
        headers: {
            'X-Shopify-Access-Token': accessToken,
        },
    })     
    let filters = []; let selectedProducts = [];    

    //For detailed edit history view 
    if (ctx.query.selectedProducts != undefined && JSON.parse(ctx.query.selectedProducts).length > 0) {
        selectedProducts = JSON.parse(ctx.query.selectedProducts)              
        const selectedProductsRes = await querySelectedProducts(selectedProducts, client)
        ctx.body = selectedProductsRes;
        return
        
    }
    if (ctx.query.filters) {
        filters = JSON.parse(ctx.query.filters)
    }     
    const queryString = makeQueryString(filters)    

    let firstLast = 'first'
    let beforeAfter = 'after'
    let cursor = null
    if (ctx.query.afterCursor) {
        cursor = ctx.query.afterCursor
    } else if (ctx.query.beforeCursor) {
        cursor = ctx.query.beforeCursor
        beforeAfter = 'before'
        firstLast = 'last'
    }

    const variables = {
        query: queryString,
        cursor
    }
        
    //Cursor is a reference to the edge's position within the connection
    const query = `query($query: String, $cursor: String) {
        products(query:$query ${firstLast}:10 ${beforeAfter}:$cursor) {
            pageInfo {
                hasNextPage
                hasPreviousPage
            }
            edges {                                
                cursor
                node {
                    id
                    title
                    handle
                    productType
                    vendor        
                    tags
                    onlineStoreUrl
                    onlineStorePreviewUrl
                    featuredImage {
                        originalSrc
                    }                    
                }
            }
        }
    }`
    
    try {
        const products = await client.request(query, variables)             
        ctx.body = products
    } catch(err) {
        console.log('Failed getting products from Shopify: ', err)
        ctx.status = 400
    }
}

module.exports = getProducts