const express = require('express');
const router = new express.Router();
const mongoose = require('mongoose');

//const Product = mongoose.model('Product');
const Order = mongoose.model('Order');

router.post('/', async(req,res) => {
    const user = req.user;
    console.log(user)
    const cart = req.session.cart || [];

    const products = cart.map(pr => {return  {product: pr.id, count: pr.count}});
  
    const order = new Order ({
      products: products,
      user
    })
  
    await order.save();

    res.redirect('/cabinet')
});


module.exports = router;