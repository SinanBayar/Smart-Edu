const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slugify = require('slugify');

const CourseSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true, // Yazı başındaki ve sonundaki gereksiz boşlukları siler.
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  slug: {
    type: String,
    unique: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  }, // Category modeli ile ilişki oluşturduk.
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }, // User modeli ile ilişki oluşturduk.
});

CourseSchema.pre('validate', function (next) {
  // Arrow fonksiyon "()=>{}" yerine standart fonksiyon "function(){}" kullanma sebebim "this" kullanabilmek.
  this.slug = slugify(this.name, {
    lower: true,
    strict: true, // ": + " vb. karakterleri yok sayar.
  });
  next();
});

const Course = mongoose.model('Course', CourseSchema);
module.exports = Course;
