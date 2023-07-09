const nodemailer = require('nodemailer');
const Course = require('../models/Course');
const User = require('../models/User');

exports.getIndexPage = async (req, res) => {
  console.log(`Your user session id: ${req.session.userID}`); // Sayfa açılışında hangi kullanıcı varsa, onun sessionID'sini görelim.
  const courses = await Course.find().sort('-createdAt').limit(2); // En son eklenen 2 course
  const totalCourses = await Course.find().countDocuments(); // Toplam course sayısı
  const totalStudents = await User.countDocuments({ role: 'Student' }); // Toplam student sayısı
  const totalTeachers = await User.countDocuments({ role: 'Teacher' }); // Toplam student sayısı
  res.status(200).render('index', {
    page_name: 'index',
    courses,
    totalCourses,
    totalStudents,
    totalTeachers,
  });
};

exports.getAboutPage = (req, res) => {
  res.status(200).render('about', {
    page_name: 'about',
  });
};

exports.getRegisterPage = (req, res) => {
  res.status(200).render('register', {
    page_name: 'register',
  });
};

exports.getLoginPage = (req, res) => {
  res.status(200).render('login', {
    page_name: 'login',
  });
};

exports.getContactPage = (req, res) => {
  res.status(200).render('contact', {
    page_name: 'contact',
  });
};

exports.sendEmail = async (req, res) => {
  try {
    const outputMessage = `
    <h1>Mail Details</h1>
    <ul>
      <li>Name: ${req.body.name}</li>
      <li>Email: ${req.body.email}</li>
    </ul>
    <h1>Message</h1>
    <p>${req.body.message}</p>

  `;
    // email'ini "https://ethereal.email/" üzerinden oluşturabilirsin.
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: 'clifford.prohaska47@ethereal.email',
        pass: '9MRQt6FFGH2k3WrkcH',
      },
    });
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"SmartEdu Contact Form"	clifford.prohaska47@ethereal.email', // sender address
      to: 'clifford.prohaska47@ethereal.email', // list of receivers
      subject: 'SmartEdu Contact Form New Message ✔', // Subject line
      html: outputMessage, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    req.flash('success', 'We received your message succesfully');
    res.status(200).redirect('contact');
  } catch (err) {
    // req.flash('error', `Something Happened! ${err}`);
    req.flash('error', 'Something Happened!');
    res.status(200).redirect('contact');
  }
};
