const {google} = require('googleapis');
const {User} = require('../db/user');

const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_API_CLIENT_ID,
    process.env.GMAIL_API_CLIENT_SECRET,
    process.env.APP_URL
);

async function sendMail(ctx) {
    // const {shop} = ctx.session    
    const oauth2Client = new google.auth.OAuth2(
        process.env.GMAIL_API_CLIENT_ID,
        process.env.GMAIL_API_CLIENT_SECRET,
        process.env.APP_URL
    );
    const user = await User.findOne({shop: 'miraekomerco.myshopify.com'}, {googleAccessToken: 1, googleRefreshToken: 1})
    oauth2Client.setCredentials({
        refresh_token: user.googleRefreshToken
    });
    const gmail = google.gmail({version: 'v1', oauth2Client});
    
    // var base64EncodedEmail = Base64.encodeURI('hi');
    var request = gmail.users.messages.send({
        'userId': 'scottsgcho@gmail.com',
        'resource': {
            'raw': 'hi'
        }
    });
    request.execute(() => {
        console.log('done')
    });
}

async function getTokens(ctx) {
    try {
        const {shop} = ctx.session
        const code = ctx.query.code
        const {tokens} = await oauth2Client.getToken(code)
        console.log('tokens: ', tokens)
        const user = await User.findOneAndUpdate({shop}, {
            $set: {
                googleAccessToken: tokens.access_token,
                googleRefreshToken: tokens.refresh_token
            }
        }, {new: true})
        oauth2Client.setCredentials(tokens);
        ctx.body = user
    } catch (err) {
        ctx.status = 500
        console.log('Failed get google tokens')
    }
}

//React Google Auth handles this for us
function getAuthCode(ctx) {    
    // generate a url that asks permissions for Blogger and Google Calendar scopes
    const scopes= [
        'https://mail.google.com/',
        'https://www.googleapis.com/auth/gmail.compose',
        'https://www.googleapis.com/auth/gmail.modify',
        'https://www.googleapis.com/auth/gmail.send',
        'profile',
        'email'
    ]
    
    const url = oauth2Client.generateAuthUrl({
        // 'online' (default) or 'offline' (gets refresh_token)
        access_type: 'offline',
        // If you only need one scope you can pass it as a string
        scope: scopes
    });
    
    ctx.body = url
}

module.exports = {getTokens, getAuthCode, sendMail};