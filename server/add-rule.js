// ctx.body = "example" sends a response with body
// ctx.status = 200 sets a status
// ctx.throw(400, 'message) sends an error message and shuts down app
// ctx.set('example', 1) sets header value of example to 1
// ctx.cookies.set('example', 1) sets cookie

const {Rule} = require('./db/rule');

//Returns user on the render of the index file on client side
async function addRule(ctx) {
    try {        
        const shop = ctx.session.shop
        const body = JSON.parse(ctx.request.rawBody)
        const {filters, selectedProducts, emails} = body
        const rule = new Rule({
            shop, filters, selectedProducts, emails
        });
        await rule.save()
        ctx.status = 200
        ctx.body = 'rule saved'
    } catch (err) {
        console.log('Failed saving rule: ', err)
        ctx.status = 400
    }
}

//Returns user on the render of the index file on client side
async function editRule(ctx) {
    try {                
        const body = JSON.parse(ctx.request.rawBody)
        const {_id, filters, selectedProducts, emails} = body
        await Rule.findByIdAndUpdate(_id, {$set: {
            filters, selectedProducts, emails
        }})
        ctx.status = 200
        ctx.body = 'rule saved'
    } catch (err) {
        console.log('Failed editing rule: ', err)
        ctx.status = 400
    }
}



module.exports = {addRule, editRule}