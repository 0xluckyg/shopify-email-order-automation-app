// https://github.com/googleapis/google-api-nodejs-client/blob/c00d1892fe70d7ebf934bcebe3e8a5036c62440c/README.md#manually-refreshing-access-token
const {google} = require('googleapis');
const {User} = require('../db/user');
const {Base64} = require('js-base64');
const axios = require('axios');
var googleAuth = require('google-auth-library');

/*************/
/** HELPERS **/
/*************/

function createConnection() {
    return new google.auth.OAuth2(
        process.env.GMAIL_API_CLIENT_ID,
        process.env.GMAIL_API_CLIENT_SECRET,
        process.env.APP_URL
    );
}

function getConnectionUrl(auth) {
    const scopes= [
        'https://mail.google.com/',
        'https://www.googleapis.com/auth/gmail.compose',
        'https://www.googleapis.com/auth/gmail.modify',
        'https://www.googleapis.com/auth/gmail.send',
        'profile',
        'email'
    ]
    return auth.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: scopes
    });
}

function getGmailApi(auth) {
    return google.gmail({ version: 'v1', auth });
}

/*************/
/** MAIN **/
/*************/

async function sendMail(ctx) {
    try {
    // const {shop} = ctx.session    
    let oauth2Client = createConnection()
    const user = await User.findOne({shop: 'miraekomerco.myshopify.com'}, {googleAccessToken: 1, googleRefreshToken: 1})
    // console.log('token info: ', user.googleAccessToken)
    // const tokenInfo = await axios.post(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${user.googleAccessToken}`)
    // console.log('token info: ', tokenInfo)
    // const tokenInfo = await oauth2Client.getTokenInfo(user.googleAccessToken)
    

    oauth2Client.setCredentials({
        access_token: user.googleAccessToken,
        refresh_token: user.googleRefreshToken
    });

    await oauth2Client.refreshAccessToken((err, tokens) => {
        // access_token is now refreshed and stored in oauth2Client        
        if (err) {
            console.log('Failed refreshing tokens: ', err)
        }
        console.log('new tokens: ', tokens)
    });

    const gmail = getGmailApi(oauth2Client);
    
    var base64EncodedEmail = Base64.encodeURI('hi\nsup');
    gmail.users.messages.send({
        auth: oauth2Client,
        userId: 'me',
        resource: {
            raw: base64EncodedEmail
        }
    }, (err, res) => {
        if (err) {
            console.log('Failed sending gmail, gmail error: ', err)
        }
        console.log('res: ', res)
    });
    } catch (err) {
        console.log('Failed sending gmail: ', err)
    }
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
    const oauth2Client = createConnection()    
    const url = getConnectionUrl(oauth2Client)
    
    ctx.body = url
}

module.exports = {getTokens, getAuthCode, sendMail};