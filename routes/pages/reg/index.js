const express = require('express');
const router = new express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//подключаем модель пользователя 
const User = mongoose.model('User');

router.get('/', function(req, res, next) {
  res.render('register');
});

//определение пары ключ-значение
router.post('/',async function(req, res, next) {
  const body = req.body;
  
// процесс регистрации
  const user = new User({
    email: body['username'],
    password: body['password'],
    name: body['name'],
    last_name: body['last_name'],
    surname: body['surname'],
    phone: body['phone'],
    address: {
      region: body['region'],
      city: body['city'],
      street: body['street'],
      house: body['house'],
      apartment: body['apartment'],
      zip: body['zip']
    },
    birthday: Date.parse(body['birthday']),
  });

  try {
    await user.save();
    res.redirect('/');
  } catch(err) {
    next(err);
  }
});


module.exports = router;
