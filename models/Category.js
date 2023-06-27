const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slugify = require('slugify');

const CategorySchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
  },
});

CategorySchema.pre('validate', function (next) { // Arrow fonksiyon "()=>{}" yerine standart fonksiyon "function(){}" kullanma sebebim "this" kullanabilmek.
  this.slug = slugify(this.name, {
    lower: true,
    strict: true, // ": + " vb. karakterleri yok sayar.
  });
  next();
});

const Category = mongoose.model('Category', CategorySchema);
module.exports = Category;
