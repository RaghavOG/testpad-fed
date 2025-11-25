const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/products - Get all products with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) {
        filter.price.$gte = parseFloat(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        filter.price.$lte = parseFloat(req.query.maxPrice);
      }
    }
    
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }
    
    if (req.query.brand) {
      filter.brand = { $regex: req.query.brand, $options: 'i' };
    }
    
    if (req.query.featured === 'true') {
      filter.featured = true;
    }

    // Build sort object
    let sort = {};
    if (req.query.sortBy) {
      const sortBy = req.query.sortBy;
      const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
      sort[sortBy] = sortOrder;
    } else {
      sort = { createdAt: -1 }; // Default sort by newest
    }

    // Execute query
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Product.countDocuments(filter);
    
    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts: total,
        hasNextPage,
        hasPrevPage,
        limit
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/products/categories - Get all unique categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/products/brands - Get all unique brands
router.get('/brands', async (req, res) => {
  try {
    const brands = await Product.distinct('brand');
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/products/price-range - Get price range
router.get('/price-range', async (req, res) => {
  try {
    const result = await Product.aggregate([
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]);
    
    if (result.length > 0) {
      res.json({
        minPrice: result[0].minPrice,
        maxPrice: result[0].maxPrice
      });
    } else {
      res.json({ minPrice: 0, maxPrice: 0 });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/products - Create new product (for admin use)
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;