const express = require('express');
const router = new express.Router();
const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);

const Product = mongoose.model('Product');

router.get('/add', function(req, res, next) {
  res.render('add');
})

// /product/add
router.post('/add',async function(req, res, next) {
    const body = req.body;

    const product = new Product({
        product_name: body["product_name"],
        characteristics: body["characteristics"],
        selling_price: body["selling_price"],
        description: body["description"],
        picture: body["picture"]
    })
    
    try {
        await product.save()
        res.redirect('/');
    } catch(e) {console.log(e)}  
});

router.get('/:id', async (req,res) => {

    const product = await Product.findById(req.params.id)

    res.render('product', {
        
        product
    });
})

router.get('/:id/edit', async (req,res) => {
    if (!req.query.allow) {
        return res.redirect('/')
    }

    const product = await Product.findById(req.params.id)
    
    res.render('product-edit', {
        title: 'Редактировать',
        product
    })
})

router.post('/edit', async (req,res) => {
    const {id} = req.body
    delete req.body.id

    await Product.findByIdAndUpdate(id,req.body)

    res.redirect('/')
})

router.post('/delete', async (req,res) => {

    try {
        await Product.deleteOne({_id: req.body.id}) 
        res.redirect('/')
    } catch (e) {
        console.log(e);
        
    }
    
})
// /product/delete

// /product/edit

module.exports = router