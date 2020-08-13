// запрос зависимостей и необходимых файлов
const express = require('express');
const morgan = require('morgan')
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const mongoose = require('mongoose');
const moment = require('moment');

// подключение к MongoDB
/*mongoose.connect('mongodb://localhost/onlineStore',function(err) {
    if (err) throw err;

    console.log('Mongodb has started...');
});*/

// подключение к MongoDB
const mongodbUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/onlineStore';

// Connect to DB
mongoose.set('debug', true);

mongoose.connect(mongodbUri, {useNewUrlParser: true})
    .then(() => {
      console.log(moment().format() +
      ' [mongoose] connection established to ' +
      mongodbUri);
    })
    .catch((err) => {
      console.error(moment().format() +
      ' [mongoose] connection error ' +
      err);
      process.exit(1);
    });
// Результат инициализации Express присваивается константе app
const app = express()
app.use(morgan('dev'));

app.locals.moment = moment;


// настройка промежуточного ПО для bodyparser, cookie, session и passport
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
  cookie: { maxAge: 24 * 60 * 60 * 1000 },
  secret: 'somesecretword',
  saveUninitialized: false,
  resave: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// модели

require('./models/user');
require('./models/product');
require('./models/order');

// подключение препроцессора Pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// настройка маршрутов
app.use(require('./routes'));


// обработка ошибок 404
app.use((req, res, next) => {
  res.render('notFound');
});
 
// настройка сервера на прослушивание запросов по 3000 порту
app.listen(3000, () => console.log('Server started listening on port 3000!'));

