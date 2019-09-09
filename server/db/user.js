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
        sparse: true,
        type: String
    },
    gmail: {        
        googleRefreshToken: {
            type: String
        },
        isActive: false
    },
    //recurring subscription model
    payment: {
        lock: {
            type: Boolean,
            default: false
        },
        plan: {
            type: Number
        },
        accepted: {
            type: Boolean,
            default: false
        },
        date: {
            type: Date,
            default: Date.now
        }
    },
    settings: {
        sendMethod: {
            method: {
                //automatic / manual
                type: String,
                default: "manual"
            },
            //unused
            frequency: {
                //1: once a day, 2: once per 2 days, 7: once a week... etc
                type: Number,
                default: 1
            },
            //unused
            time: {
                //Hour in UTC offset format
                type: String,
                default: 8
            }
        },
        PDFSettings: {
            PDFOrderLimit: {
                type: Number,
                default: 100
            }
        },
        subjectTemplateText: {
            type: String
        },
        headerTemplateText: {
            type: String
        },
        orderTemplateText: {
            type: String
        },
        productTemplateText: {
            type: String
        },
        footerTemplateText: {
            type: String
        }
    }
},{
    timestamps: true // Saves createdAt and updatedAt as dates
});

//Creating a new user example
const User = mongoose.model('Users', UserSchema);

module.exports = {User};
