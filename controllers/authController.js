const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator'); // Validation sonuçlarını buradan çalıştırıyoruz.
const User = require('../models/User');
const Category = require('../models/Category');
const Course = require('../models/Course');

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).redirect('/login');
  } catch (error) {
    const result = validationResult(req);
    // console.log(result); // Register sayfasında tıklanınca çıkan error'ü konsola yazdırıyoruz
    // console.log(result.array()[0].msg); // Register sayfasında tıklanınca çıkan error'deki mesajı konsola yazdırıyoruz
    for (let i = 0; i < result.array().length; i++) {
      req.flash('error', `${result.array()[i].msg}`);
    }
    res.status(400).redirect('/register');
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }); // Artık mongoDB'de callback function kullanılmadığı için mail ile aradığımız kullanıcıyı önce user değişkenine atıyoruz. Daha sonra bu user değişkeni true ise yeni işlemler yapıyoruz.
    if (user) { // Girilen kullanıcı adı var ise;
      bcrypt.compare(password, user.password, (err, same) => {
        if (same) { // Password'ü doğru girmemiz durumu
          // USER SESSION
          req.session.userID = user._id;
          res.status(200).redirect('/users/dashboard');
        } else { // Password'ü yanşlış girmemiz durumu
          req.flash('error', 'Your password is not correct!');
          res.status(400).redirect('/login');
        }
      });
    } else { // Girilen kullanıcı adı yok ise;
      req.flash('error', 'User is not exist!');
      res.status(400).redirect('/login');
    }
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

exports.logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

exports.getDashboardPage = async (req, res) => {
  const user = await User.findOne({ _id: req.session.userID }).populate(
    'courses'
  ); // id'si, session'daki userID'ye eşit olan kullanıcıyı bul.
  const categories = await Category.find();
  const courses = await Course.find({ user: req.session.userID });
  const users = await User.find();
  res.status(200).render('dashboard', {
    page_name: 'dashboard',
    user,
    categories,
    courses,
    users,
  });
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);
    await Course.deleteMany({ user: req.params.id }); // Silinen Teacher'a ait tüm kursları da siliyoruz.
    req.flash('error', `${user.name} has been removed!`);
    res.status(200).redirect('/users/dashboard');
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};
