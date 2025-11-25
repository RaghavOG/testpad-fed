import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Rating,
  Divider,
  IconButton,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  TextField,
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  Share,
  ArrowBack,
  Add,
  Remove,
  LocalOffer,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/api/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    // Show success message or navigate to cart
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const discountPercentage = product?.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Back to Home
        </Button>
      </Container>
    );
  }

  const specifications = Array.from(product.specifications?.entries() || []);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{ mb: 3 }}
        >
          Back to Products
        </Button>

        <Grid container spacing={4}>
          {/* Product Images */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card sx={{ mb: 2, position: 'relative', overflow: 'hidden' }}>
                {discountPercentage > 0 && (
                  <Chip
                    icon={<LocalOffer />}
                    label={`${discountPercentage}% OFF`}
                    color="secondary"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      left: 16,
                      zIndex: 1,
                      fontWeight: 600,
                    }}
                  />
                )}
                <Box
                  component="img"
                  src={product.images?.[selectedImage] || product.imageUrl}
                  alt={product.name}
                  sx={{
                    width: '100%',
                    height: 500,
                    objectFit: 'cover',
                  }}
                />
              </Card>
              
              {product.images && product.images.length > 1 && (
                <Grid container spacing={1}>
                  {product.images.map((image, index) => (
                    <Grid item xs={3} key={index}>
                      <Card
                        sx={{
                          cursor: 'pointer',
                          border: selectedImage === index ? 2 : 0,
                          borderColor: 'primary.main',
                        }}
                        onClick={() => setSelectedImage(index)}
                      >
                        <Box
                          component="img"
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          sx={{
                            width: '100%',
                            height: 80,
                            objectFit: 'cover',
                          }}
                        />
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </motion.div>
          </Grid>

          {/* Product Details */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Box sx={{ mb: 2 }}>
                <Chip
                  label={product.category}
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                {product.featured && (
                  <Chip
                    label="Featured"
                    color="primary"
                    sx={{ mb: 2, ml: 1 }}
                  />
                )}
              </Box>

              <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                {product.name}
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                {product.description}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating
                  value={product.rating}
                  readOnly
                  precision={0.1}
                  sx={{ mr: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  ({product.numReviews} reviews)
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      color: 'primary.main',
                      mr: 2,
                    }}
                  >
                    ${product.price.toFixed(2)}
                  </Typography>
                  {product.originalPrice && (
                    <Typography
                      variant="h5"
                      sx={{
                        textDecoration: 'line-through',
                        color: 'text.secondary',
                      }}
                    >
                      ${product.originalPrice.toFixed(2)}
                    </Typography>
                  )}
                </Box>
                <Typography
                  variant="body1"
                  color={product.stock > 0 ? 'success.main' : 'error.main'}
                  sx={{ fontWeight: 500 }}
                >
                  {product.stock > 0 
                    ? `${product.stock} items in stock` 
                    : 'Out of stock'
                  }
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Brand: <strong>{product.brand}</strong>
              </Typography>

              <Divider sx={{ my: 3 }} />

              {/* Quantity and Add to Cart */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Quantity
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <IconButton
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    sx={{ border: '1px solid', borderColor: 'divider' }}
                  >
                    <Remove />
                  </IconButton>
                  <TextField
                    value={quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (value >= 1 && value <= product.stock) {
                        setQuantity(value);
                      }
                    }}
                    inputProps={{
                      min: 1,
                      max: product.stock,
                      style: { textAlign: 'center' },
                    }}
                    sx={{
                      mx: 1,
                      width: 80,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 0,
                      },
                    }}
                  />
                  <IconButton
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    sx={{ border: '1px solid', borderColor: 'divider' }}
                  >
                    <Add />
                  </IconButton>
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<ShoppingCart />}
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    sx={{
                      flex: 1,
                      py: 1.5,
                      fontWeight: 600,
                      background: 'linear-gradient(45deg, #2563eb, #3b82f6)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1d4ed8, #2563eb)',
                      },
                    }}
                  >
                    Add to Cart
                  </Button>
                  
                  <IconButton
                    size="large"
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      '&:hover': {
                        backgroundColor: 'primary.main',
                        color: 'white',
                      },
                    }}
                  >
                    <FavoriteBorder />
                  </IconButton>
                  
                  <IconButton
                    size="large"
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Share />
                  </IconButton>
                </Box>
              </Box>

              {/* Product Tags */}
              {product.tags && product.tags.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    Tags
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {product.tags.map((tag, index) => (
                      <Chip key={index} label={tag} variant="outlined" size="small" />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Specifications */}
              {specifications.length > 0 && (
                <Card sx={{ mt: 3 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Specifications
                    </Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableBody>
                          {specifications.map(([key, value], index) => (
                            <TableRow key={index}>
                              <TableCell sx={{ fontWeight: 500, width: '40%' }}>
                                {key}
                              </TableCell>
                              <TableCell>{value}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProductPage;