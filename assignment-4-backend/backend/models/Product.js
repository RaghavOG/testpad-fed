const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    default: null
  },
  category: {
    type: String,
    required: true,
    enum: ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Beauty', 'Toys', 'Automotive']
  },
  brand: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String
  }],
  specifications: {
    type: Map,
    of: String
  }
}, {
  timestamps: true
});

// Index for search and filtering
productSchema.index({ name: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ featured: 1 });

module.exports = mongoose.model('Product', productSchema);