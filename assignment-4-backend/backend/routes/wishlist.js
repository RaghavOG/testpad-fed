const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Add to wishlist
router.post('/add/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if product is already in wishlist
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Product is already in wishlist'
      });
    }

    // Add to wishlist
    user.wishlist.push(productId);
    await user.save();

    res.json({
      success: true,
      message: 'Product added to wishlist',
      wishlistCount: user.wishlist.length
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding to wishlist',
      error: error.message
    });
  }
});

// Remove from wishlist
router.delete('/remove/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if product is in wishlist
    const productIndex = user.wishlist.indexOf(productId);
    if (productIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'Product not found in wishlist'
      });
    }

    // Remove from wishlist
    user.wishlist.splice(productIndex, 1);
    await user.save();

    res.json({
      success: true,
      message: 'Product removed from wishlist',
      wishlistCount: user.wishlist.length
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error removing from wishlist',
      error: error.message
    });
  }
});

// Get user's wishlist
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 12, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const user = await User.findById(req.user._id)
      .populate({
        path: 'wishlist',
        select: 'name price images category brand rating numReviews stock description',
        options: {
          sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 },
          skip: (page - 1) * limit,
          limit: parseInt(limit)
        }
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const totalItems = user.wishlist.length;
    const totalPages = Math.ceil(totalItems / limit);

    res.json({
      success: true,
      wishlist: user.wishlist,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching wishlist',
      error: error.message
    });
  }
});

// Check if product is in wishlist
router.get('/check/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const isInWishlist = user.wishlist.includes(productId);

    res.json({
      success: true,
      isInWishlist
    });
  } catch (error) {
    console.error('Check wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error checking wishlist',
      error: error.message
    });
  }
});

// Clear wishlist
router.delete('/clear', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.wishlist = [];
    await user.save();

    res.json({
      success: true,
      message: 'Wishlist cleared successfully'
    });
  } catch (error) {
    console.error('Clear wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error clearing wishlist',
      error: error.message
    });
  }
});

// Move wishlist items to cart
router.post('/move-to-cart', auth, async (req, res) => {
  try {
    const { productIds } = req.body; // Array of product IDs to move

    if (!productIds || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No products specified'
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let movedCount = 0;
    const errors = [];

    for (const productId of productIds) {
      // Check if product is in wishlist
      if (!user.wishlist.includes(productId)) {
        errors.push(`Product ${productId} not found in wishlist`);
        continue;
      }

      // Check if product already in cart
      const existingCartItem = user.cart.find(item => 
        item.product.toString() === productId.toString()
      );

      if (existingCartItem) {
        // Increment quantity if already in cart
        existingCartItem.quantity += 1;
      } else {
        // Add new item to cart
        user.cart.push({ product: productId, quantity: 1 });
      }

      // Remove from wishlist
      user.wishlist = user.wishlist.filter(id => id.toString() !== productId.toString());
      movedCount++;
    }

    await user.save();

    res.json({
      success: true,
      message: `${movedCount} products moved to cart`,
      movedCount,
      errors: errors.length > 0 ? errors : undefined,
      cartCount: user.cart.length,
      wishlistCount: user.wishlist.length
    });
  } catch (error) {
    console.error('Move to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error moving items to cart',
      error: error.message
    });
  }
});

module.exports = router;