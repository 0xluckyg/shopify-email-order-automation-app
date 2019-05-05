// ctx.body = "example" sends a response with body
// ctx.status = 200 sets a status
// ctx.throw(400, 'message) sends an error message and shuts down app
// ctx.set('example', 1) sets header value of example to 1
// ctx.cookies.set('example', 1) sets cookie

const {Order} = require('./db/order');

async function getOrdersByDay(ctx) {               
    try {        
        const shop = ctx.session.shop
        const skip = parseInt(ctx.query.skip)        
        const total = await Order.countDocuments({shop})
        const rules = await Order.find({shop})
        .sort({createdAt: -1})
        .skip(skip)
        .limit(10)        
        ctx.body = {rules, total}
    } catch (err) {
        console.log('Failed getting orders: ', err)
        ctx.status = 400
    }
}

async function getOrders(ctx) {               
    try {        
        const shop = ctx.session.shop
        const skip = parseInt(ctx.query.skip)        
        const total = await Order.countDocuments({shop})
        const rules = await Order.find({shop})
        .sort({createdAt: -1})
        .skip(skip)
        .limit(10)        
        ctx.body = {rules, total}
    } catch (err) {
        console.log('Failed getting orders: ', err)
        ctx.status = 400
    }
}

module.exports = {getOrdersByDay, getOrders}