// https://stackoverflow.com/questions/5818303/how-do-i-perform-an-id-array-query-in-mongoose/5822327

const mongoose = require('mongoose');

//Creating a new todo example
const ProcessedOrderSchema = new mongoose.Schema({        
    title: String,
    order_id: String,
    order_date: Date,
    product_id: Number,
    variant_id: Number,    
    shop: String,
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
ProcessedOrderSchema.index({
    shop: String,
    order_id: String,
    product_id: String
});

//Creating a new user example
const ProcessedOrder = mongoose.model('ProcessedOrderSchema', ProcessedOrderSchema);

module.exports = {ProcessedOrder};