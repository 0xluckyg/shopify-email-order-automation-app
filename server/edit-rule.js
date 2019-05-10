const {Rule} = require('./db/rule');

function convertFiltersIntoParams(filters) {
    filters = JSON.parse(filters) 
    params = {}
    filters.forEach(filter => {
        let {key, value} = filter
        params[key] = value
    })
    return params
}

//Returns user on the render of the index file on client side
async function addRule(ctx) {
    try {        
        const shop = ctx.session.shop
        const body = JSON.parse(ctx.request.rawBody)
        let {filters, selectedProducts, email} = body
        filters = convertFiltersIntoParams(filters)
        const rule = new Rule({
            shop, filters, selectedProducts, email
        });
        await rule.save()
        ctx.status = 200
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
        filters = convertFiltersIntoParams(filters)
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