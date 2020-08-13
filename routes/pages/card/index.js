const express = require('express');
const router = new express.Router();
const mongoose = require('mongoose');

const Product = mongoose.model('Product');
const Order = mongoose.model('Order');

/*function mapCartItems(cart) {
    return cart.items.map(p => ({
        ...p.productId._doc, count: p.count
    }))
  }
  
function computePrice(products) {
    return products.reduce((total,product) => {
        return total += product.selling_price*product.count
    }, 0 )
}*/

router.post('/add', async (req,res) => {
    const cart = req.session.cart || [];
    const productId = req.body.id;

    // [{id: 123, count: 50}, {id: 123, count: 50}, {id: 123, count: 50}, {id: 123, count: 50}] 
    const productInCart = cart.find(el => el.id === productId);

    if (productInCart) {
      productInCart.count++;
    } else {
      cart.push({id: productId, count: 1})
    }
    
    req.session.cart = cart;
    res.redirect('/card');
});

// /card/delete, POST, id: 123, deleteAll: boolean
router.post('/delete', (req, res, next) => {
    const cart = req.session.cart || [];
    const productId = req.body.id;

    const productInCart = cart.find(el => el.id === productId);

    if (!productId) {
      res.redirect('/card');
    }

    if (req.body.deleteAll) {
      productInCart.count = 0;
    } else {
      productInCart.count--;
    }

    if (productInCart.count === 0) {
      cart.splice(cart.indexOf(productInCart), 1);
    }

    req.session.cart = cart;
    res.redirect('/card');
});

router.post('/push', (req, res, next) => {
  const cart = req.session.cart || [];
  const productId = req.body.id;

  const productInCart = cart.find(el => el.id === productId);

  if (!productId) {
    res.redirect('/card');
  }

  if (req.body.deleteAll) {
    productInCart.count = 0;
  } else {
    productInCart.count++;
  }

  if (productInCart.count === 0) {
    cart.splice(cart.indexOf(productInCart), 1);
  }

  req.session.cart = cart;
  res.redirect('/card');
});


router.get('/', async (req,res) => {
    const cart = req.session.cart || [];

    const ids = cart.map(el => mongoose.Types.ObjectId(el.id));

    const products = await Product.find({'_id': {$in: ids}}).lean();
    const cartData = products.map(product => {
      return {
        ...product, 
        count: cart.find(cartItem => product._id.toString() === cartItem.id).count
      }
    });

    res.render('card', {cartData});
  });

module.exports = router;