import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Badge, 
  Box, 
  IconButton,
  Container
} from '@mui/material';
import { 
  ShoppingCart, 
  Store,
  Search as SearchIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

const Navbar = () => {
  const navigate = useNavigate();
  const { getCartCount } = useCart();

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'background.paper', color: 'text.primary', boxShadow: 1 }}>
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box 
            component={motion.div}
            whileHover={{ scale: 1.05 }}
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            <Store sx={{ mr: 1, color: 'primary.main', fontSize: 32 }} />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #2563eb, #f59e0b)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              ShopHub
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="text"
              sx={{ color: 'text.primary', fontWeight: 500 }}
              onClick={() => navigate('/')}
            >
              Home
            </Button>
            
            <Button
              variant="text"
              sx={{ color: 'text.primary', fontWeight: 500 }}
            >
              Categories
            </Button>
            
            <Button
              variant="text"
              sx={{ color: 'text.primary', fontWeight: 500 }}
            >
              Deals
            </Button>

            <IconButton
              component={motion.div}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/cart')}
              sx={{ ml: 2 }}
            >
              <Badge badgeContent={getCartCount()} color="primary">
                <ShoppingCart />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;