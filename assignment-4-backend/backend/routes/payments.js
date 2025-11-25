const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const express = require('express');
const Order = require('../models/Order');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Create payment intent
router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    const { amount, currency = 'usd', orderId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount is required and must be greater than 0'
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        userId: req.user._id.toString(),
        orderId: orderId || ''
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating payment intent',
      error: error.message
    });
  }
});

// Confirm payment
router.post('/confirm-payment', auth, async (req, res) => {
  try {
    const { paymentIntentId, orderId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment intent ID is required'
      });
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Update order if provided
      if (orderId) {
        const order = await Order.findById(orderId);
        if (order && order.user.toString() === req.user._id.toString()) {
          order.paymentInfo.status = 'completed';
          order.paymentInfo.transactionId = paymentIntentId;
          order.paymentInfo.paidAt = new Date();
          await order.save();
        }
      }

      res.json({
        success: true,
        message: 'Payment confirmed successfully',
        paymentStatus: paymentIntent.status
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment not successful',
        paymentStatus: paymentIntent.status
      });
    }
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error confirming payment',
      error: error.message
    });
  }
});

// Create refund
router.post('/create-refund', auth, async (req, res) => {
  try {
    const { paymentIntentId, amount, reason = 'requested_by_customer' } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment intent ID is required'
      });
    }

    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined, // Partial refund if amount specified
      reason
    });

    res.json({
      success: true,
      message: 'Refund processed successfully',
      refund: {
        id: refund.id,
        amount: refund.amount / 100,
        status: refund.status
      }
    });
  } catch (error) {
    console.error('Create refund error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing refund',
      error: error.message
    });
  }
});

// Get payment methods for customer
router.get('/payment-methods', auth, async (req, res) => {
  try {
    // In a real app, you'd store customer IDs in your user model
    // For now, we'll return empty array
    res.json({
      success: true,
      paymentMethods: []
    });
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment methods',
      error: error.message
    });
  }
});

// Webhook endpoint for Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      
      // Update order status if orderId is in metadata
      if (paymentIntent.metadata.orderId) {
        try {
          await Order.findByIdAndUpdate(
            paymentIntent.metadata.orderId,
            {
              'paymentInfo.status': 'completed',
              'paymentInfo.transactionId': paymentIntent.id,
              'paymentInfo.paidAt': new Date(),
              orderStatus: 'confirmed'
            }
          );
        } catch (error) {
          console.error('Error updating order after payment:', error);
        }
      }
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      
      // Update order status if orderId is in metadata
      if (failedPayment.metadata.orderId) {
        try {
          await Order.findByIdAndUpdate(
            failedPayment.metadata.orderId,
            {
              'paymentInfo.status': 'failed',
              orderStatus: 'cancelled'
            }
          );
        } catch (error) {
          console.error('Error updating order after payment failure:', error);
        }
      }
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

module.exports = router;