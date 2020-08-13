const mongoose = require('mongoose');

const productScheme = new mongoose.Schema({
    product_name: {
        type: String,
        required: [true, 'can not be blank']
    },
    picture:{
        type: String,
        match: [
          /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
          'is invalid'],
    },
    purchase_price:{
        type: Number,
    },
    selling_price: {
        type: Number,
        required: [true, 'can not be blank']
    },
    delivery_date:{
        type: Date,
        
    },
    count: {
        type: Number,
    },
    rating: Number,
    characteristics: {
        type: String,
          
    },
    description: {
        type: String,
            
    },

});

var Product = mongoose.model('Product', productScheme);

module.exports = Product;