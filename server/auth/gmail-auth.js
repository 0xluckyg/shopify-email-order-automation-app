// https://github.com/googleapis/google-api-nodejs-client/blob/c00d1892fe70d7ebf934bcebe3e8a5036c62440c/README.md#manually-refreshing-access-token
const {google} = require('googleapis');
const {User} = require('../db/user');
const {Base64} = require('js-base64');
const MailComposer = require('nodemailer/lib/mail-composer');

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
        // 'https://mail.google.com/',
        // 'https://www.googleapis.com/auth/gmail.compose',
        // 'https://www.googleapis.com/auth/gmail.modify',
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

async function saveToken(shop, googleRefreshToken) {
    return await User.findOneAndUpdate({shop}, {
        $set: {
            gmail: {                
                googleRefreshToken,
                isActive: true
            }
        }
    }, {new: true})    
}

/*************/
/** UNUSED **/
/*************/

//React Google Auth handles this for us. Not actually using it for the applciation.
function getAuthCode(ctx) {    
    // generate a url that asks permissions
    const oauth2Client = createConnection()    
    const url = getConnectionUrl(oauth2Client)
    
    ctx.body = url
}

//Refreshes gmail token automatically. Not documented in googleapis
function refreshGmailToken(shop, oauth2Client) {
    return new Promise((resolve, reject) => {
        oauth2Client.refreshAccessToken(async (err, tokens) => {
            // access_token is now refreshed and stored in oauth2Client        
            if (err) {
                console.log('Failed refreshing tokens: ', err)
                reject(err)
            }
            await saveToken(shop, tokens.refresh_token)
            resolve()
        });
    })
}

/*************/
/** MAIN **/
/*************/

async function getTokens(ctx) {
    try {
        const {shop} = ctx.session
        const code = ctx.query.code
        const oauth2Client = createConnection()
        const {tokens} = await oauth2Client.getToken(code)
        const user = await saveToken(shop, tokens.refresh_token)

        oauth2Client.setCredentials(tokens);
        ctx.body = user
    } catch (err) {
        ctx.status = 500
        console.log('Failed get google tokens: ', err)
    }
}

async function gmailLogout(ctx) {
    try {
        const {shop} = ctx.session
        const user = await User.findOneAndUpdate({shop}, {
            $set: {
                'gmail.isActive': false                
            }
        }, {new: true})    

        ctx.body = user
    } catch (err) {
        console.log('Failed logging out user: ', err)
    }
}

module.exports = {createConnection, getTokens, gmailLogout};