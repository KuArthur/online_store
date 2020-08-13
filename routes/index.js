const express = require('express');
const router = new express.Router();
const mongoose = require('mongoose');

const Product = mongoose.model('Product');
const User = mongoose.model('User');

// создание переменной для использование в pug
router.use('/', (req, res, next) => {
  res.locals.user = req.user;
  next();
});

// объявление маршрутов
router.get('/', async function(req, res, next) {
  const products = await Product.find({});
  const users = await User.find ({});

  res.render('index', {
      isProduct: true,
      products: products,
      users: users
  })
});

router.get('/search', async function(req,res,next) {
  const {query} = req.query;
  
  console.log(query)
  const products = await Product.find({ 
    product_name: {
    $regex: query,
    $options: 'i'
  
  }});
  console.log(products)
  res.render('index',{
    placeholder: query,
    products:products
  })
})

  router.use('/', require('./pages')); 

module.exports = router;
