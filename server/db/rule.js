const mongoose = require('mongoose');

//Creating a new todo example
const RuleSchema = new mongoose.Schema({    
    shop: String,    
    email: String,
    filters: [ {key: String, value: String} ],
    selectedProducts: [ String ],    
},{
    timestamps: true // Saves createdAt and updatedAt as dates
});

//Allows find by shop to be faster by making it an index
RuleSchema.index({
    shop: 1    
});

//Creating a new user example
const Rule = mongoose.model('Rule', RuleSchema);

module.exports = {Rule};