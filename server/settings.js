// ctx.body = "example" sends a response with body
// ctx.status = 200 sets a status
// ctx.throw(400, 'message) sends an error message and shuts down app
// ctx.set('example', 1) sets header value of example to 1
// ctx.cookies.set('example', 1) sets cookie

const {User} = require('./db/user');

//Returns user on the render of the index file on client side
async function getSettings(ctx) {
    const shop = ctx.session.shop       
    if (shop) {
        try {
            const settings = await User.findOne({shop}).select({ "sendMethod": 1, "templateText": 1})            
            ctx.body = settings
        } catch (err) {
            ctx.status = 400
        }
    } else {
        ctx.status = 400
    }
}

async function setTemplateText(ctx) {
    const shop = ctx.session.shop       
    const body = JSON.parse(ctx.request.rawBody)    
    if (shop) {
        try {
            await User.findOneAndUpdate({shop}, { $set: { "templateText": body.templateText } })
            ctx.body = 'saved template text'
        } catch (err) {
            ctx.status = 400
        }
    } else {
        ctx.status = 400
    }
}

async function setSendMethod(ctx) {
    const shop = ctx.session.shop       
    const body = JSON.parse(ctx.request.rawBody)    
    if (shop) {
        try {
            await User.findOneAndUpdate({shop}, { $set: { "sendMethod.method": body.sendMethod } })
            ctx.body = 'saved send method'
        } catch (err) {
            ctx.status = 400
        }
    } else {
        ctx.status = 400
    }
}

module.exports = {getSettings, setSendMethod, setTemplateText}