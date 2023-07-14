const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
});

const Category = mongoose.model('Category', schema);

module.exports = Category;
