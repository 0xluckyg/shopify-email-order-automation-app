const {User} = require('../db/user')
const crypto = require('crypto');
const safeCompare = require('safe-compare');

//
async function switchSession(ctx, next) {
    try {
        const {SHOPIFY_API_SECRET_KEY} = process.env;
        const {shop, hmac, timestamp} = ctx.query
        if (!shop || !hmac) return await next()
        var generatedHash = crypto
        .createHmac("sha256", SHOPIFY_API_SECRET_KEY)
        .update('shop=' + shop + '&timestamp=' + timestamp)
        .digest("hex");
                
        if (safeCompare(generatedHash, hmac)) {            
            ctx.session = {shop}                        
            console.log('sess1: ',ctx.session)
            await next()
        } else {
            ctx.throw('invalid')
        }
    } catch(err) {
        console.log('Failed switchSession: ',err.message)
        ctx.status = 400
        ctx.body = err.message
    }
}

async function logout(ctx) {    
    try {
        const {shop} = ctx.session        
        await User.findOneAndUpdate(
            { shop },
            { $set: { active: false } }
        )
        ctx.session = null
        ctx.body = 'logged out'
    } catch (err) {
        console.log('Failed logout: ', err)
    }
}

module.exports = {logout, switchSession}