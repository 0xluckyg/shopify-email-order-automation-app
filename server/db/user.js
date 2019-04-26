const mongoose = require('mongoose');

//Creating a new todo example
const UserSchema = new mongoose.Schema({
    type: {
        //shopify, woocommerce, bigcommerce, etc
        type: String,
        default: "shopify"
    },
    //whether the app is installed on the store or not
    active: {
        type: Boolean,
        default: true
    },
    shop: {
        //shop-name.myshopify.com
        unique: true,
        type: String,        
    },
    //unique access token for each store from Shopify.
    //When access mode is set to "offline", Shopify returns the same accessToken until uninstalled
    accessToken: {
        unique: true,
        type: String
    },
    //recurring subscription model
    payment: {
        accepted: {
            type: Boolean,
            default: false
        },
        date: {
            type: Date,
            default: Date.now
        }
    }
},{
    timestamps: true // Saves createdAt and updatedAt as dates
});

//Creating a new user example
const User = mongoose.model('Users', UserSchema);

module.exports = {User};
