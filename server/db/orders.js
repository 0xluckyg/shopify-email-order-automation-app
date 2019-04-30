const mongoose = require('mongoose');

//Creating a new todo example
const OrderSchema = new mongoose.Schema({        
    shop: String,  
    // Generated messages that appear at the top of an order page in the Shopify admin  
    alerts: {
        severity: {
            type: String,
            // DEFAULT
            // INFO
            // WARNING
            // SUCCESS
            // CRITICAL
            default: "DEFAULT"
        },
        title: String
    },
    canMarkAsPaid: Boolean,
    cancelReason: {
        type:String,
        // CUSTOMER
        // The customer wanted to cancel the order.
        // FRAUD        
        // INVENTORY        
        // DECLINED        
        // OTHER
        // null 
        default: null       
    },
    capturable: Boolean,
    closed: Boolean,
    closedAt: Date,    
    currencyCode: {
        type: String,
        default: "USD"
    },
    customer: {
        displayName: String,        
        id: String,
        ordersCount: Number,        
        totalSpent: String,        
    },
    discountCode: String,
    disputes: [{
        id: String,
        // CHARGEBACK
        // INQUIRY
        initiatedAs: String,
        // NEEDS_RESPONSE
        // UNDER_REVIEW
        // CHARGE_REFUNDED
        // ACCEPTED
        // WON
        // LOST
        status: String
    }],
    email: String,
    fulfillable: Boolean,
    id: String,
    // Unique identifier for the order that appears on the order. For example, #1000 or _Store1001.
    name: String,
    phone: String,
    // Date and time when the order was processed. When orders are imported from an app, this date and time may not match the date and time when the order was created.
    processedAt: Date,
    refundable: Boolean,
    riskLevel: {
        type: String,
        // LOW
        // MEDIUM
        // HIGH
        default: "LOW"
    },
    shippingAddress: {

    },
    tags: [String],
    totalPriceSet: {

    },
    totalRefundedSet: {

    },
    // Total weight (grams) of the order.
    totalWeight: Number,
    unpaid: Boolean,
    updatedAtShop: Date,    
},{
    timestamps: true // Saves createdAt and updatedAt as dates
});

//Allows find by shop to be faster by making it an index
OrderSchema.index({
    shop: 1,
    name: 1,
    id: 1
});

//Creating a new user example
const Orders = mongoose.model('Orders', OrderSchema);

module.exports = {Orders};