// ctx.body = "example" sends a response with body
// ctx.status = 200 sets a status
// ctx.throw(400, 'message) sends an error message and shuts down app
// ctx.set('example', 1) sets header value of example to 1
// ctx.cookies.set('example', 1) sets cookie

const {User} = require('./db/user');

//Returns user on the render of the index file on client side
async function getUser(ctx) {
    console.log('ctx.sess: ', ctx.session)
    const shop = ctx.session.shop       
    if (shop) {
        try {
            const user = await User.findOne({shop})
            console.log('user: ', user)
            delete user.accessToken
            ctx.body = user
        } catch (err) {
            ctx.status = 400
        }
    } else {
        ctx.status = 400
    }
}

module.exports = getUser