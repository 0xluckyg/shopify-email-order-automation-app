// https://github.com/googleapis/google-api-nodejs-client/blob/c00d1892fe70d7ebf934bcebe3e8a5036c62440c/README.md#manually-refreshing-access-token
const {google} = require('googleapis');
const {User} = require('../db/user');
const {Base64} = require('js-base64');

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

async function saveTokens(shop, googleAccessToken, googleRefreshToken) {
    return await User.findOneAndUpdate({shop}, {
        $set: {
            gmail: {
                googleAccessToken,
                googleRefreshToken
            }
        }
    }, {new: true})    
}

function refreshGmailToken(shop, oauth2Client) {
    return new Promise((resolve, reject) => {
        oauth2Client.refreshAccessToken(async (err, tokens) => {
            // access_token is now refreshed and stored in oauth2Client        
            if (err) {
                console.log('Failed refreshing tokens: ', err)
                reject(err)
            }
            await saveTokens(shop, tokens.access_token, tokens.refresh_token)
            console.log('new tokens: ', tokens)
            
            resolve()
        });
    })
}


function getGmailApi(auth) {
    return google.gmail({ version: 'v1', auth });
}

function getRawEmail(from, to, subject, body) {
    const RFC2822 = 
`From: ${from}
To: ${to}
Subject: ${subject}

body: ${body}`

    let base64EncodedEmail = Base64.encodeURI(RFC2822);
    let URLSafeEncodedEmail = base64EncodedEmail.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return URLSafeEncodedEmail
}

function gmailSend(shop, client, from, to, subject, body, isRefreshed) {
    return new Promise(async (resolve, reject) => {
        try {
            const gmail = getGmailApi(client);   
            const rawEmail = getRawEmail(from, to, subject, body)
            gmail.users.messages.send({
                auth: client,
                userId: 'me',
                resource: {
                    raw: rawEmail
                }
            }, async (err, res) => {
                if (err) {
                    if (isRefreshed) { 
                        console.log('Refreshed token but could not send gmail: ', err)
                        return reject(err) 
                    }
                    console.log('Refreshing token')
                    await refreshGmailToken(shop, client)
                    await gmailSend(shop, client, from, to, subject, body, true)
                    resolve(res)
                }
                resolve(res)
            });
        } catch (err) {
            console.log('Failed gmailSend: ', err)
            reject(err)
        }
    })
}

/*************/
/** MAIN **/
/*************/

async function sendMail(shop, gmail, from, to, subject, body) {
    try {    
        let oauth2Client = createConnection()    

        //TEST
        shop = 'miraekomerco.myshopify.com'
        let user = await User.findOne({shop})
        gmail = {
            googleAccessToken: user.gmail.googleAccessToken,
            googleRefreshToken: user.gmail.googleRefreshToken
        }
        from = 'choentrepreneurship@gmail.com',
        to = 'scottsgcho@gmail.com',
        subject = 'test 5',
        body = 'this is body!!'
        //TEST

        oauth2Client.setCredentials({
            access_token: gmail.googleAccessToken,
            refresh_token: gmail.googleRefreshToken
        });        
            
        const res = await gmailSend(
            shop, oauth2Client, from, to, subject, body, false
        )
        
        const newToken = res.config.headers.Authorization.replace('Bearer ', '')
        console.log('acc token: ', user.gmail.googleAccessToken)
        console.log('res: ', newToken)
        if (user.gmail.googleAccessToken != newToken) {
            console.log('save')
            await saveTokens(shop, newToken, user.gmail.googleRefreshToken)
        }
        return (res) ? true : false    
    } catch (err) {        
        console.log('Failed sending mail: ', err)
        return false
    }
}

async function getTokens(ctx) {
    try {
        const {shop} = ctx.session
        const code = ctx.query.code
        const {tokens} = await oauth2Client.getToken(code)
        console.log('tokens: ', tokens)
        const user = await saveTokens(shop, tokens.access_token, tokens.refresh_token)

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