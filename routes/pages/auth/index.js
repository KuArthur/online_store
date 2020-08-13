const express = require('express');
const router = new express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const User = mongoose.model('User');

//устанавливает id как cookie в браузере пользователя
passport.serializeUser(function(user, done) {
  done(null, user.email);
});

//получает id из cookie, который затем используется в обратном вызове для получения информации о пользователе
passport.deserializeUser(function(email, done) {
  User.findOne({email: email}).
      then((user) => done(null, user)).catch((err) => done(err));
});

// аутентификация
passport.use(new LocalStrategy(
    async function(email, password, done) {
      try {
        const user = await User.findOne({email});

        if (!user) {
          return done(null, false);
        }

        if (await bcrypt.compare(password, user.password)) { 
          return done(null, user);
        }
        
        return done(null, false);
      } catch (err) {
        return done(err);
      }
    }
));

// /auth/login
router.get('/login', function(req, res, next) {
  res.render('auth');
})

// callback
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: 'login',
}));

// Выход
router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
