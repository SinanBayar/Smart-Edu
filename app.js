const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');

const pageRoute = require('./routes/pageRoute');
const courseRoute = require('./routes/courseRoute');
const categoryRoute = require('./routes/categoryRoute');
const userRoute = require('./routes/userRoute');

const app = express();
const port = 3000;

// Connect DB
mongoose
  .connect('mongodb://127.0.0.1:27017/smartedu-db')
  .then(() => {
    console.log('DB Connected Succesfully');
  })
  .catch((err) => {
    console.log(err);
  });

// Global Variable
global.userIN = null; // Globalde userIN isimli bir değişken oluşturuyoruz.

// Template Engine
app.set('view engine', 'ejs');

// Middlewares
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'my_keyboard_cat',
    resave: false,
    saveUninitialized: true,
  })
);

// Routes
app.use('*', (req, res, next) => { 
  userIN = req.session.userID; // Globaldeki userIN değişkenimizi login yapıldığındaki userID ile eşleştiriyoruz.
  next();
});
app.use('/', pageRoute);
// Artık get, post vs yerine use ile kullanıyoruz.
app.use('/courses', courseRoute);
app.use('/categories', categoryRoute);
app.use('/users', userRoute);

app.listen(port, () => {
  console.log(`App started on port ${port}`);
});
