// ctx.body = "example" sends a response with body
// ctx.status = 200 sets a status
// ctx.throw(400, 'message) sends an error message and shuts down app
// ctx.set('example', 1) sets header value of example to 1
// ctx.cookies.set('example', 1) sets cookie

const {Rule} = require('./db/rule');

async function getRules(ctx) {               
    try {        
        const shop = ctx.session.shop
        const skip = parseInt(ctx.query.skip)        
        const total = await Rule.countDocuments({shop})
        const rules = await Rule.find({shop}, {products: 0})
        .sort({createdAt: -1})
        .skip(skip)
        .limit(10)
        console.log('rules ', rules)
        ctx.body = {rules, total}
    } catch (err) {
        console.log('Failed getting rules: ', err)
        ctx.status = 400
    }
}

module.exports = getRules