import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  CreditCard,
  Payment,
  Lock,
  CheckCircle,
} from '@mui/icons-material';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key_here');

const CheckoutForm = ({ cartItems, total, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user, token } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Create payment intent when component mounts
    createPaymentIntent();
  }, [total]);

  const createPaymentIntent = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/payments/create-payment-intent', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: total,
          currency: 'usd'
        }),
      });

      const data = await response.json();
      if (data.success) {
        setClientSecret(data.clientSecret);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to initialize payment');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError('');

    const card = elements.getElement(CardElement);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: card,
        billing_details: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
        },
      }
    });

    if (result.error) {
      setError(result.error.message);
      setProcessing(false);
    } else {
      // Payment succeeded
      onPaymentSuccess(result.paymentIntent);
    }
  };

  const cardStyle = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          <Lock sx={{ mr: 1, verticalAlign: 'middle' }} />
          Secure Payment
        </Typography>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <CardElement options={cardStyle} />
        </Paper>
      </Box>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={!stripe || processing}
        startIcon={processing ? <CircularProgress size={20} /> : <Payment />}
      >
        {processing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
      </Button>
    </Box>
  );
};

const CheckoutPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(true);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState('');

  // Order totals
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    
    loadCartData();
  }, [isAuthenticated, navigate]);

  const loadCartData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/cart', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCartItems(data.cart.items);
        setSubtotal(data.cart.summary.subtotal);
        setTax(data.cart.summary.tax);
        setShipping(data.cart.summary.shipping);
        setTotal(data.cart.summary.total);
        
        // Set default address if available
        if (user?.addresses?.length > 0) {
          const defaultAddr = user.addresses.find(addr => addr.isDefault);
          setSelectedAddress(defaultAddr?._id || user.addresses[0]._id);
        }
        setAddresses(user?.addresses || []);
      }
    } catch (error) {
      setError('Failed to load cart data');
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (paymentIntent) => {
    try {
      const selectedAddr = addresses.find(addr => addr._id === selectedAddress);
      
      const orderData = {
        items: cartItems.map(item => ({
          product: item.product._id,
          quantity: item.quantity
        })),
        shippingAddress: selectedAddr,
        billingAddress: selectedAddr,
        paymentInfo: {
          method: 'card',
          transactionId: paymentIntent.id,
          status: 'completed'
        }
      };

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();
      if (result.success) {
        setOrderData(result.order);
        setOrderSuccess(true);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Failed to create order');
    }
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    await createOrder(paymentIntent);
  };

  const handleOrderComplete = () => {
    setOrderSuccess(false);
    navigate('/orders');
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', p: 4 }}>
        <Typography variant="h5">Your cart is empty</Typography>
        <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Continue Shopping
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>

      <Grid container spacing={3}>
        {/* Left Column - Shipping & Payment */}
        <Grid item xs={12} md={8}>
          {/* Shipping Address */}
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Shipping Address
            </Typography>
            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                value={selectedAddress}
                onChange={(e) => setSelectedAddress(e.target.value)}
              >
                {addresses.map((address) => (
                  <FormControlLabel
                    key={address._id}
                    value={address._id}
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="subtitle2">
                          {address.firstName} {address.lastName}
                          {address.isDefault && ' (Default)'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {address.address}, {address.city}, {address.state} {address.zipCode}
                        </Typography>
                      </Box>
                    }
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Paper>

          {/* Payment Method */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Payment Method
            </Typography>
            <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
              <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel
                  value="card"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CreditCard sx={{ mr: 1 }} />
                      Credit/Debit Card
                    </Box>
                  }
                />
              </RadioGroup>
            </FormControl>

            {paymentMethod === 'card' && (
              <Elements stripe={stripePromise}>
                <CheckoutForm
                  cartItems={cartItems}
                  total={total}
                  onPaymentSuccess={handlePaymentSuccess}
                />
              </Elements>
            )}
          </Paper>
        </Grid>

        {/* Right Column - Order Summary */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, position: 'sticky', top: 100 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            
            <List>
              {cartItems.map((item) => (
                <ListItem key={item._id} sx={{ px: 0 }}>
                  <ListItemText
                    primary={item.product.name}
                    secondary={`Qty: ${item.quantity}`}
                  />
                  <Typography variant="body2">
                    ${item.itemTotal.toFixed(2)}
                  </Typography>
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Subtotal:</Typography>
              <Typography>${subtotal.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Tax:</Typography>
              <Typography>${tax.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Shipping:</Typography>
              <Typography>${shipping.toFixed(2)}</Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6" color="primary">
                ${total.toFixed(2)}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Success Dialog */}
      <Dialog open={orderSuccess} onClose={handleOrderComplete} maxWidth="sm" fullWidth>
        <DialogContent sx={{ textAlign: 'center', p: 4 }}>
          <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Order Placed Successfully!
          </Typography>
          <Typography color="text.secondary" paragraph>
            Your order #{orderData?.orderNumber} has been confirmed.
            You will receive an email confirmation shortly.
          </Typography>
          <Typography variant="h6" color="primary">
            Total: ${orderData?.totalPrice.toFixed(2)}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button variant="contained" onClick={handleOrderComplete}>
            View Orders
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CheckoutPage;