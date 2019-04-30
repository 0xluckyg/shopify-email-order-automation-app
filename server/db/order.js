const mongoose = require('mongoose');

//Creating a new todo example
const OrderSchema = new mongoose.Schema({        
    //NEEDED BY APP
    shop: String,  

    //PROVIDED BY WEBHOOOK
    id: String,
    email: String,
    closed_at: null,    
    updated_at: Date,    
    note: null,    
    test: Boolean,
    total_price: String,    
    total_weight: 0,
    total_tax: String,    
    currency: String,    
    confirmed: Boolean,
    total_discounts: String,
    total_line_items_price: String,    
    referring_site: null,
    cancelled_at: Date,
    cancel_reason: String,    
    processed_at: null,    
    customer_locale: String,
    landing_site_ref: null,
    order_number: Number,
    // checkout, direct,  manual, offsite, and express.
    processing_method: String,
    source_name: String,
    fulfillment_status: String,
    tags: String,
    order_status_url: String,
    shipping_lines: [
    {
        id: String,
        title: String,
        price: String,
        carrier_identifier: String,
    }
    ],
    shipping_address: {
        first_name: String,
        address1: String,
        phone: String,
        city: String,
        zip: String,
        province: String,
        country: String,
        last_name: String,
        address2: String,
        company: String,
        country_code: String,
        province_code: String
    },        
    customer: {
        id: String,
        email: String,
        created_at: Date,
        updated_at: Date,
        first_name: String,
        last_name: String,
        orders_count: Number,
        total_spent: String,
        last_order_id: String,
        note: String,                
        tax_exempt: Boolean,
        phone: String,
        tags: String,
        currency: String
    }
},{
    timestamps: true // Saves createdAt and updatedAt as dates
});

//Allows find by shop to be faster by making it an index
OrderSchema.index({
    shop: 1,
    order_number: 1,
    id: 1
});

//Creating a new user example
const Order = mongoose.model('Order', OrderSchema);

module.exports = {Order};