const mongoose = require('mongoose');

//Creating a new todo example
const ProductSchema = new mongoose.Schema({
    //PROVIDED BY WEBHOOK        
    id: String,
    variant_id: Number,
    //Title of product
    title: String,
    quantity: Number,
    sku: String,
    variant_title: String,
    vendor: String,
    fulfillment_service: String,
    product_id: Number,
    requires_shipping: Boolean,
    taxable: Boolean,    
    //Name of product variant
    name: String,
    properties: [
        {
            //ex: custom engraving
            name: String,
            // Happy Birthday Mom!    
            value: String,
        }
    ],
    product_exists: Boolean,
    fulfillable_quantity: Number,
    grams: Number,
    price: String,
    total_discount: String,
    fulfillment_status: String,
    
    //NOT PROVIDED BY WEBHOOK
    tags: [String],
    product_type: String,
    gtin: String,

    //NEEDED BY APP
    shop: String,
    order_id: String,
    order_number: Number,
    emails: [{
        email: {
            type: String,
            unique: true
        },
        sent: Boolean
    }]
},{
    timestamps: true // Saves createdAt and updatedAt as dates
});

//Allows find by shop to be faster by making it an index
ProductSchema.index({
    shop: String,
    order_id: String
});

//Creating a new user example
const Products = mongoose.model('Products', ProductSchema);

module.exports = {Products};