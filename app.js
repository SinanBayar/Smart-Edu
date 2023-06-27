const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

const pageRoute = require('./routes/pageRoute');
const courseRoute = require('./routes/courseRoute');
const categoryRoute = require('./routes/categoryRoute');

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

// Template Engine
app.set('view engine', 'ejs');

// Middlewares
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/', pageRoute);
// Artık get, post vs yerine use ile kullanıyoruz.
app.use('/courses', courseRoute);
app.use('/categories', categoryRoute);

app.listen(port, () => {
  console.log(`App started on port ${port}`);
});
