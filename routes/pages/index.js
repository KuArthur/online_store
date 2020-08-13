const express = require('express');
const router = new express.Router();

router.use('/reg', require('./reg'));
router.use('/auth', require('./auth'));
router.use('/product', require('./product'));
router.use('/card', require('./card'));
router.use('/cabinet',require('./cabinet'))
router.use('/orders',require('./orders'))

// Ошибки
router.use(function(err, req, res, next) {
  if (err.name === 'ValidationError') {
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce(function(errors, key) {
        errors[key] = err.errors[key].message;
        return errors;
      }, {}),
    });
  }

  next(err);
});


module.exports = router;
