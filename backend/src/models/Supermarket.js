const mongoose = require('mongoose');

const supermarketSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    default: '#FF0000',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Supermarket', supermarketSchema);

