const mongoose = require('mongoose');

const orderScheme = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required:true
            },
            count:{
                type: Number,
                required: true
            },
            
        }
    ],
    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    date: {
        type: Date,
        default: Date.now
    }
})

var Order = mongoose.model('Order', orderScheme);

module.exports = Order;