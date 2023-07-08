const Course = require('../models/Course');
const Category = require('../models/Category');
const User = require('../models/User');

exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      user: req.session.userID,
    });
    req.flash('success', `${course.name} has been created successfully`);
    res.status(201).redirect('/courses');
  } catch (error) {
    req.flash('error', 'Something happened!');
    res.status(400).redirect('/courses');
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const categorySlug = req.query.categories; // query'den gelen parametre(categories) yakalanıyor.
    const query = req.query.search; // query'den gelen parametre(search(formdaki name="search")) yakalanıyor.
    const category = await Category.findOne({ slug: categorySlug });
    let filter = {};
    if (categorySlug) {
      filter = { category: category._id };
    }

    if (query) {
      filter = { name: query };
    }

    if (!query && !categorySlug) {
      (filter.name = ''), (filter.category = null);
    }

    const courses = await Course.find({
      $or: [
        { name: { $regex: '.*' + filter.name + '.*', $options: 'i' } },
        { category: filter.category },
      ],
    })
      .sort('-createdAt')
      .populate('user');
    const categories = await Category.find();

    res.status(200).render('courses', {
      courses,
      categories,
      page_name: 'courses',
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug }).populate(
      'user'
    );
    // findById ile _id: req.params.id kullanmak yerine, findOne ile slug: req.params.slug kullanıyoruz.
    // populate kullanarak course modeline bağlı olan user modelindeki bilgileri de kullanabiliyoruz.
    const user = await User.findById(req.session.userID);
    const categories = await Category.find();
    res.status(200).render('course', {
      course,
      user,
      categories,
      page_name: 'courses',
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

exports.enrollCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    await user.courses.push({ _id: req.body.course_id }); // addToSet() kullanarak aynı kursun tekrar eklenmesi engellenebilirdi fakat sonraki derste bu durumu daha farklı çözeceğiz.
    await user.save();
    res.status(200).redirect('/users/dashboard');
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

exports.releaseCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    await user.courses.pull({ _id: req.body.course_id });
    await user.save();
    res.status(200).redirect('/users/dashboard');
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findOneAndRemove({ slug: req.params.slug });
    req.flash('error', `${course.name} has been removed successfully`);
    res.status(200).redirect('/users/dashboard');
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};
