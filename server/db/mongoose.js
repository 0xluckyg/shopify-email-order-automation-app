const mongoose = require('mongoose');

//Tells mongoose we're using bluebird promise
mongoose.Promise = require('bluebird');

console.log('Connecting to DB: ', process.env.MONGODB_URI)
mongoose.connect(process.env.MONGODB_URI, err => {
    if (!err) return
    console.log('Failed to connect to MongoDB: ', err)
    throw err
});

module.exports = {mongoose};
