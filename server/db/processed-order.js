// https://stackoverflow.com/questions/5818303/how-do-i-perform-an-id-array-query-in-mongoose/5822327

const mongoose = require('mongoose');

//Creating a new todo example
const ProcessedOrderSchema = new mongoose.Schema({    
    shop: String,
    email: String,
    title: String,
    order_id: String,
    order_date: Date,
    product_id: Number,
    variant_id: Number,    
    order_number: Number,    
},{
    timestamps: true // Saves created
});

//Allows find by shop to be faster by making it an index
ProcessedOrderSchema.index({
    shop: String,
    order_date: String
});

//Creating a new user example
const ProcessedOrder = mongoose.model('Processed-Orders', ProcessedOrderSchema);

module.exports = {ProcessedOrder};