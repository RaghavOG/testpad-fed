import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Rating,
  IconButton,
} from '@mui/material';
import { 
  ShoppingCart, 
  Favorite, 
  FavoriteBorder,
  LocalOffer 
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Card
      component={motion.div}
      whileHover={{ 
        y: -8,
        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
      }}
      transition={{ duration: 0.2 }}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
      }}
      onClick={handleCardClick}
    >
      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <Chip
          icon={<LocalOffer />}
          label={`${discountPercentage}% OFF`}
          color="secondary"
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            zIndex: 1,
            fontWeight: 600,
            boxShadow: '0 2px 4px rgb(0 0 0 / 0.1)',
          }}
        />
      )}

      {/* Featured Badge */}
      {product.featured && (
        <Chip
          label="Featured"
          color="primary"
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 1,
            fontWeight: 600,
            boxShadow: '0 2px 4px rgb(0 0 0 / 0.1)',
          }}
        />
      )}

      <CardMedia
        component="img"
        height="240"
        image={product.imageUrl}
        alt={product.name}
        sx={{
          objectFit: 'cover',
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        }}
      />

      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 600,
            mb: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.3,
          }}
        >
          {product.name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {product.description}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating
            value={product.rating}
            readOnly
            precision={0.1}
            size="small"
            sx={{ mr: 1 }}
          />
          <Typography variant="body2" color="text.secondary">
            ({product.numReviews})
          </Typography>
        </Box>

        <Chip
          label={product.category}
          variant="outlined"
          size="small"
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
              }}
            >
              ${product.price.toFixed(2)}
            </Typography>
            {product.originalPrice && (
              <Typography
                variant="body2"
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
            variant="body2"
            color={product.stock > 0 ? 'success.main' : 'error.main'}
            sx={{ fontWeight: 500 }}
          >
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<ShoppingCart />}
            fullWidth
            disabled={product.stock === 0}
            onClick={handleAddToCart}
            sx={{
              py: 1,
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
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;