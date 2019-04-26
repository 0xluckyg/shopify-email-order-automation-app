const withCSS = require('@zeit/next-css');
const webpack = require('webpack');

//Configuring the use of Polaris CSS on Webpack.
//Writing on next.config.js file overrides the default next.js config settings
module.exports = withCSS({
    webpack: config => {
        const env = { API_KEY: JSON.stringify(process.env.SHOPIFY_API_KEY) };

        config.plugins.push(new webpack.DefinePlugin(env));
        return config;
    }
});