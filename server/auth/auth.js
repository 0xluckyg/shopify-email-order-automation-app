const {User} = require('../db/user');

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

module.exports = {logout}