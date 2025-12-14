const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  originalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  discountPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  discountPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  supermarketId: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);

