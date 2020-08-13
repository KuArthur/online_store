const express = require('express');
const router = new express.Router();
const mongoose = require('mongoose');

const User = mongoose.model('User');
const Order = mongoose.model('Order');

router.get('/:id/edit', async (req,res) => {
  if (!req.query.allow) {
      return res.redirect('/')
  }

  const user = await User.findById(req.params.id)
  
  res.render('cabinet-edit', {
      title: 'Редактировать профиль'
  })
})

router.post('/edit', async (req,res) => {
  const {id} = req.body
  delete req.body.id

  await User.findByIdAndUpdate(id,req.body)

  res.redirect('/')
})

router.get('/', async function(req, res, next) {
    const user = req.user;

    const calcOrderCost = (order) => {
      return order.products.reduce((acc, product) => acc + product.count * product.product.selling_price, 0);
    }

    if (user.status === 'User') {
      const orders = await Order.find({user});
      const populatedOrders =  [];

      for (let i = 0; i < orders.length; i++) {
          const o = orders[i];
          const p = await o.populate('products.product').execPopulate();
          p.totalCost = calcOrderCost(p);
          populatedOrders.push(p);
      }

      return res.render('cabinet', {orders: populatedOrders});
    } else {
      let sellerOrders = await Order.aggregate([
        { $group: { _id: '$user', orders: { $push: '$_id' } } } 
      ]);

      sellerOrders = await Order.populate(sellerOrders, {path: 'orders'});
      sellerOrders = await Order.populate(sellerOrders, {path: 'orders.products.product', model: 'Product'});

      for (let i = 0; i < sellerOrders.length; i++) {
        const userOrders = sellerOrders[i];
        userOrders.orders = userOrders.orders.map(order => {
            order.totalCost = calcOrderCost(order);
            return order;
        });
      }

      res.render('cabinet', {sellerOrders});
    }
  });

 
module.exports = router;