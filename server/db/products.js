const mongoose = require('mongoose');

//Creating a new todo example
const ProductSchema = new mongoose.Schema({        
    shop: String,
    orderName: String,
    orderId: String,    
    fulfillableQuantity: Number,
    fulfillableQuantity: Number,
    fulfillmentService: {
        handle: String,
        id: String,
        serviceName: String,        
    },    
    fulfillmentStatus: String,
    id: String,
    image: {
        originalSrc: String,
        transformedSrc: String
    },
    name: String,
    originalTotalSet: {

    },
    product: {

    },
    quantity: Number,
    sku: String,
    taxable: Boolean,
    title: String,
    unfulfilledQuantity: Number,
    variant: {

    },
    variantTitle: String,
    vendor: String,
    // Date and time when the order was processed. When orders are imported from an app, this date and time may not match the date and time when the order was created.
    processedAt: Date,
    emails: [{
        email: String,
        sent: Boolean
    }]
},{
    timestamps: true // Saves createdAt and updatedAt as dates
});

//Allows find by shop to be faster by making it an index
ProductSchema.index({
    shop: 1,
    orderName: 1,
    orderId: 1
});

//Creating a new user example
const Products = mongoose.model('Products', ProductSchema);

module.exports = {Products};