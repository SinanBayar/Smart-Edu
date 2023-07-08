const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Student', 'Teacher', 'Admin'], // Alabileceği değerler.
    default: 'Student',
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
  ], // Bir kullanıcının birden fazla aldığı kurs olabileceği için "[{}]" içerisinde yazdık.
});

// Bcrypt kullanırken user'ların içeriği güncellenince şifreler de değişiyor. Bu bug'ı çözmek için; 
// https://stackoverflow.com/questions/43706606/how-to-prevent-mongoose-from-rehashing-the-user-passwords-after-modifying-a-user
// UserSchema.pre('save', function (next) {
//   const user = this;
//   bcrypt.hash(user.password, 10, (error, hash) => {
//     user.password = hash;
//     next();
//   });
// });

UserSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) return next(); // Eğer kullanıcı password'ü modifiye edilmemişse devam et.
  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
