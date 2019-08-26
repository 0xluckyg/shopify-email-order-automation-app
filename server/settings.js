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
            const user = await User.findOne({shop}).select({ 
                "settings": 1
            })
            ctx.body = user.settings
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
            await User.findOneAndUpdate({shop}, { 
                $set: { 
                    "settings.subjectTemplateText": body.subjectTemplateText,
                    "settings.headerTemplateText": body.headerTemplateText, 
                    "settings.orderTemplateText": body.orderTemplateText,
                    "settings.productTemplateText": body.productTemplateText,
                    "settings.footerTemplateText": body.footerTemplateText
                } 
            })         
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
            await User.findOneAndUpdate({shop}, { 
                $set: { "settings.sendMethod.method": body.sendMethod } 
            })
            ctx.body = 'saved send method'
        } catch (err) {
            ctx.status = 400
        }
    } else {
        ctx.status = 400
    }
}

async function setPDFOrderLimit(ctx) {
    const shop = ctx.session.shop       
    const body = JSON.parse(ctx.request.rawBody)    
    if (shop) {
        try {
            await User.findOneAndUpdate({shop}, { 
                $set: { "settings.PDFSettings.PDFOrderLimit": body.PDFOrderLimit } 
            })
            ctx.body = 'saved PDF order limit'
        } catch (err) {
            ctx.status = 400
        }
    } else {
        ctx.status = 400
    }
}

module.exports = {getSettings, setSendMethod, setTemplateText, setPDFOrderLimit}