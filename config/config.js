//config.json file contains:
// "PORT":
// "MONGODB_URI":
// "SHOPIFY_API_KEY":
// "SHOPIFY_API_SECRET_KEY":
// "APP_URL":
// "APP_EMAIL":
// "APP_EMAIL_PW":

const config = require('./config.json');
const env = process.env.NODE_ENV || 'development';

console.log('Running on env: ', env);

const envConfig = config[env];

//Gets keys from config.json file and saves them to process environment variables
Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
});