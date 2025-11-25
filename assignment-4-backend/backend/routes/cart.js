const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Get cart
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'cart.product',
        select: 'name price images category brand stock description'
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Filter out any cart items where product no longer exists
    const validCartItems = user.cart.filter(item => item.product);
    
    if (validCartItems.length !== user.cart.length) {
      user.cart = validCartItems;
      await user.save();
    }

    // Calculate totals
    let subtotal = 0;
    const cartItems = validCartItems.map(item => {
      const itemTotal = item.product.price * item.quantity;
      subtotal += itemTotal;
      
      return {
        _id: item._id,
        product: item.product,
        quantity: item.quantity,
        itemTotal
      };
    });

    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 50 ? 0 : 9.99;
    const total = subtotal + tax + shipping;

    res.json({
      success: true,
      cart: {
        items: cartItems,
        summary: {
          subtotal,
          tax,
          shipping,
          total,
          itemCount: cartItems.length,
          totalQuantity: cartItems.reduce((sum, item) => sum + item.quantity, 0)
        }
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching cart',
      error: error.message
    });
  }
});

// Add to cart
router.post('/add', auth, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check stock availability
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if product already in cart
    const existingItemIndex = user.cart.findIndex(item => 
      item.product.toString() === productId.toString()
    );

    if (existingItemIndex > -1) {
      // Update quantity
      const newQuantity = user.cart[existingItemIndex].quantity + quantity;
      
      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add ${quantity} items. Only ${product.stock - user.cart[existingItemIndex].quantity} more available`
        });
      }
      
      user.cart[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item
      user.cart.push({ product: productId, quantity });
    }

    await user.save();

    res.json({
      success: true,
      message: 'Product added to cart',
      cartCount: user.cart.length
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding to cart',
      error: error.message
    });
  }
});

// Update cart item quantity
router.put('/update/:cartItemId', auth, async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const cartItem = user.cart.id(cartItemId);
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    // Check product stock
    const product = await Product.findById(cartItem.product);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`
      });
    }

    cartItem.quantity = quantity;
    await user.save();

    res.json({
      success: true,
      message: 'Cart updated successfully'
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating cart',
      error: error.message
    });
  }
});

// Remove from cart
router.delete('/remove/:cartItemId', auth, async (req, res) => {
  try {
    const { cartItemId } = req.params;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const cartItem = user.cart.id(cartItemId);
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    user.cart.pull(cartItemId);
    await user.save();

    res.json({
      success: true,
      message: 'Item removed from cart',
      cartCount: user.cart.length
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error removing from cart',
      error: error.message
    });
  }
});

// Clear cart
router.delete('/clear', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.cart = [];
    await user.save();

    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error clearing cart',
      error: error.message
    });
  }
});

// Move cart item to wishlist
router.post('/move-to-wishlist/:cartItemId', auth, async (req, res) => {
  try {
    const { cartItemId } = req.params;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const cartItem = user.cart.id(cartItemId);
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    const productId = cartItem.product;

    // Check if already in wishlist
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
    }

    // Remove from cart
    user.cart.pull(cartItemId);
    await user.save();

    res.json({
      success: true,
      message: 'Item moved to wishlist',
      cartCount: user.cart.length,
      wishlistCount: user.wishlist.length
    });
  } catch (error) {
    console.error('Move to wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error moving to wishlist',
      error: error.message
    });
  }
});

module.exports = router;