/* const User = require('../models/User');

module.exports = async (req, res, next) => {
  const user = await User.findById(req.session.userID);
  if (!user) {
    res.redirect('/login');
  }
  next();
}; */

// Örnekte asenkron olarak yapılmıştı fakat aşağıdaki şekilde de çalışıyor. Sebebi araştırılacak.

// VEYA

module.exports = (req, res, next) => {
  if (!req.session.userID) {
    res.redirect('/login');
  } else {
    next();
  }
};
