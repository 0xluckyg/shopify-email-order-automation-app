const {Rule} = require('./db/rule');
const {needsUpgradeForAddRule} = require('./auth/shopify-payment')

function convertFiltersIntoParams(filters, selectedProducts) { 
    //params are ignored if there are product ids in selectedProducts
    if (selectedProducts && selectedProducts.length > 0) return {}    
    return filters
}

//Returns user on the render of the index file on client side
async function addRule(ctx) {
    try {        
        const shop = ctx.session.shop
        
        const needsUpgrade = await needsUpgradeForAddRule(shop)
        if (needsUpgrade) {
            ctx.status = 400
            ctx.body = 'needs upgrade'
            return
        }
        
        const body = JSON.parse(ctx.request.rawBody)
        let {filters, selectedProducts, email} = body        
        filters = convertFiltersIntoParams(filters, selectedProducts)        
        const rule = new Rule({
            shop, filters, selectedProducts, email
        });
        await rule.save()        
        ctx.body = 'rule saved'
    } catch (err) {
        console.log('Failed saving rule: ', err)
        ctx.status = 400
    }
}

async function editRule(ctx) {
    try {                
        const body = JSON.parse(ctx.request.rawBody)
        let {_id, filters, selectedProducts, email} = body
        filters = convertFiltersIntoParams(filters, selectedProducts)
        await Rule.findByIdAndUpdate(_id, {$set: {
            filters, selectedProducts, email
        }})
        ctx.status = 200
        ctx.body = 'rule edited'
    } catch (err) {
        console.log('Failed editing rule: ', err)
        ctx.status = 400
    }
}

async function removeRule(ctx) {
    try {
        const body = JSON.parse(ctx.request.rawBody)        
        await Rule.findByIdAndRemove(body._id)
        ctx.status = 200
        ctx.body = 'rule removed'
    } catch (err) {
        console.log('Failed removing rule: ', err)
        ctx.status = 400
    }
}

module.exports = {addRule, editRule, removeRule}