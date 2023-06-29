/* module.exports = (req, res, next) => {
  if (req.session.userID) {
    res.redirect('/');
  } else {
    next();
  }
}; */

// Burada else kullanmak veya return kullanmak gerekiyor. Return kullanmadan çalışmamasının sebebi araştırılacak.

// VEYA

module.exports = (req, res, next) => {
  if (req.session.userID) {
    return res.redirect('/');
  }
  next();
};
