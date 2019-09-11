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

function getGmailApi(auth) {
    return google.gmail({ version: 'v1', auth });
}

function sendEmail(client, to, subject, body, attachments) {
    return new Promise(async (resolve, reject) => {
        let mail = new MailComposer({
            to,
            text: body,
            // html: " <strong> I hope this works </strong>",
            subject,
            textEncoding: "base64",
            attachments
        });
        
        mail.compile().build( (error, msg) => {
            if (error) {
                console.log('Failed compiling email ' + error);
                reject(error)
            } 
        
            const encodedMessage = Buffer.from(msg)
                .toString('base64')
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '');
        
            const gmail = getGmailApi(client);  
            gmail.users.messages.send({
                auth: client,
                userId: 'me',
                resource: {
                    raw: encodedMessage,
                }
            }, (err, res) => {
                if (err) {
                    console.log('Failed to send gmail from nodemailer: ' + err);
                    reject(err) 
                }
                resolve(res)
            });
        })    
    })
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

function sendEmailRFC2822(client, to, subject, body) {
    function getRawEmail(to, subject, body) {
        //don't need 'from'
        const RFC2822 = `To: ${to}\nSubject: ${subject}\n\nbody: ${body}`
        let base64EncodedEmail = Base64.encodeURI(RFC2822);
        //url protection
        let URLSafeEncodedEmail = base64EncodedEmail.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        return URLSafeEncodedEmail
    }

    return new Promise(async (resolve, reject) => {
        try {
            const gmail = getGmailApi(client);   
            const rawEmail = getRawEmail(to, subject, body)
            gmail.users.messages.send({
                auth: client,
                userId: 'me',
                resource: {
                    raw: rawEmail
                }
            }, async (err, res) => {
                if (err) { 
                    console.log('Faild gmaiSend err: ', err)
                    reject(err) 
                }
                resolve(res)
            });
        } catch (err) {
            console.log('Failed sendEmail: ', err)
            reject(err)
        }
    })
}

/*************/
/** MAIN **/
/*************/

function formatAttachment(filename, base64Data) {
    // encoded string as an attachment
    return {
        filename, content: base64Data, encoding: 'base64'
    }
}

async function sendGmail(refresh_token, to, subject, body, attachments) {
    try {    
        let oauth2Client = createConnection()    
        
        // Once the client has a refresh token, access tokens will be acquired and refreshed automatically in the next call to the API.
        oauth2Client.setCredentials({ refresh_token });            
        const res = await sendEmail(
            oauth2Client, to, subject, body, attachments
        )
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

module.exports = {getTokens, sendGmail, gmailLogout, formatAttachment};