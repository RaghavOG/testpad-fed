import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  IconButton,
  Divider,
  Paper,
  Alert,
  TextField,
} from '@mui/material';
import {
  Add,
  Remove,
  Delete,
  ShoppingCart,
  ArrowBack,
  LocalShipping,
  Security,
  CreditCard,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import AuthDialog from '../components/AuthDialog';

const CartPage = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartCount } = useCart();
  const { isAuthenticated } = useAuth();
  const [authDialogOpen, setAuthDialogOpen] = React.useState(false);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      setAuthDialogOpen(true);
    }
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/')}
            sx={{ mb: 3 }}
          >
            Back to Shopping
          </Button>

          <Paper
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            sx={{
              p: 8,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            }}
          >
            <ShoppingCart sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
              Your Cart is Empty
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Looks like you haven't added any items to your cart yet.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/')}
              sx={{
                px: 4,
                py: 1.5,
                fontWeight: 600,
                background: 'linear-gradient(45deg, #2563eb, #3b82f6)',
              }}
            >
              Start Shopping
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{ mb: 3 }}
        >
          Continue Shopping
        </Button>

        <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
          Shopping Cart ({getCartCount()} items)
        </Typography>

        <Grid container spacing={4}>
          {/* Cart Items */}
          <Grid item xs={12} lg={8}>
            <Card
              component={motion.div}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Cart Items
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={clearCart}
                    color="error"
                  >
                    Clear Cart
                  </Button>
                </Box>
                
                <Divider />

                <AnimatePresence>
                  {items.map((item, index) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Box sx={{ p: 3 }}>
                        <Grid container spacing={3} alignItems="center">
                          <Grid item xs={12} sm={3}>
                            <Box
                              component="img"
                              src={item.imageUrl}
                              alt={item.name}
                              sx={{
                                width: '100%',
                                height: 120,
                                objectFit: 'cover',
                                borderRadius: 2,
                                cursor: 'pointer',
                              }}
                              onClick={() => navigate(`/product/${item._id}`)}
                            />
                          </Grid>
                          
                          <Grid item xs={12} sm={6}>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 600,
                                mb: 1,
                                cursor: 'pointer',
                                '&:hover': { color: 'primary.main' },
                              }}
                              onClick={() => navigate(`/product/${item._id}`)}
                            >
                              {item.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {item.brand} • {item.category}
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                              ${item.price.toFixed(2)}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={12} sm={3}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                                  sx={{ border: '1px solid', borderColor: 'divider' }}
                                >
                                  <Remove />
                                </IconButton>
                                <TextField
                                  value={item.quantity}
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    if (value > 0) {
                                      handleQuantityChange(item._id, value);
                                    }
                                  }}
                                  inputProps={{
                                    min: 1,
                                    style: { textAlign: 'center' },
                                  }}
                                  sx={{
                                    mx: 1,
                                    width: 60,
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: 0,
                                    },
                                  }}
                                />
                                <IconButton
                                  size="small"
                                  onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                                  sx={{ border: '1px solid', borderColor: 'divider' }}
                                >
                                  <Add />
                                </IconButton>
                              </Box>
                              
                              <IconButton
                                onClick={() => removeFromCart(item._id)}
                                color="error"
                                sx={{ '&:hover': { backgroundColor: 'error.main', color: 'white' } }}
                              >
                                <Delete />
                              </IconButton>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                      {index < items.length - 1 && <Divider />}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </CardContent>
            </Card>
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12} lg={4}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card sx={{ position: 'sticky', top: 20 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Order Summary
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>Subtotal ({getCartCount()} items)</Typography>
                      <Typography sx={{ fontWeight: 500 }}>
                        ${subtotal.toFixed(2)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>Shipping</Typography>
                      <Typography sx={{ fontWeight: 500 }}>
                        {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography>Tax</Typography>
                      <Typography sx={{ fontWeight: 500 }}>
                        ${tax.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>

                  {subtotal < 100 && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      Add ${(100 - subtotal).toFixed(2)} more to get FREE shipping!
                    </Alert>
                  )}

                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Total
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      ${total.toFixed(2)}
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handleCheckout}
                    sx={{
                      py: 1.5,
                      fontWeight: 600,
                      background: 'linear-gradient(45deg, #2563eb, #3b82f6)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1d4ed8, #2563eb)',
                      },
                    }}
                  >
                    {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
                  </Button>

                  {/* Security Features */}
                  <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Security sx={{ fontSize: 20, color: 'success.main', mr: 1 }} />
                      <Typography variant="body2">Secure checkout</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocalShipping sx={{ fontSize: 20, color: 'success.main', mr: 1 }} />
                      <Typography variant="body2">Free shipping over $100</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CreditCard sx={{ fontSize: 20, color: 'success.main', mr: 1 }} />
                      <Typography variant="body2">Multiple payment options</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
      
      {/* Auth Dialog */}
      <AuthDialog 
        open={authDialogOpen} 
        onClose={() => setAuthDialogOpen(false)} 
      />
    </Box>
  );
};

export default CartPage;