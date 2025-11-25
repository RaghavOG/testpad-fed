import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Badge, 
  Box, 
  IconButton,
  Container,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon
} from '@mui/material';
import { 
  ShoppingCart, 
  Store,
  Search as SearchIcon,
  Person,
  Favorite,
  History,
  Settings,
  Logout,
  Login
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import AuthDialog from './AuthDialog';

const Navbar = () => {
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    navigate('/');
  };

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

            {/* Authentication Section */}
            {isAuthenticated ? (
              <Box sx={{ ml: 2 }}>
                <IconButton
                  onClick={handleProfileMenuOpen}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={Boolean(anchorEl) ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
                >
                  <Avatar sx={{ width: 32, height: 32 }}>
                    {user?.firstName?.charAt(0) || 'U'}
                  </Avatar>
                </IconButton>
                
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={Boolean(anchorEl)}
                  onClose={handleProfileMenuClose}
                  onClick={handleProfileMenuClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={() => navigate('/profile')}>
                    <ListItemIcon>
                      <Person fontSize="small" />
                    </ListItemIcon>
                    My Profile
                  </MenuItem>
                  <MenuItem onClick={() => navigate('/orders')}>
                    <ListItemIcon>
                      <History fontSize="small" />
                    </ListItemIcon>
                    Order History
                  </MenuItem>
                  <MenuItem onClick={() => navigate('/wishlist')}>
                    <ListItemIcon>
                      <Favorite fontSize="small" />
                    </ListItemIcon>
                    Wishlist
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={() => navigate('/settings')}>
                    <ListItemIcon>
                      <Settings fontSize="small" />
                    </ListItemIcon>
                    Settings
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Button
                variant="outlined"
                startIcon={<Login />}
                onClick={() => setAuthDialogOpen(true)}
                sx={{ ml: 2 }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* Auth Dialog */}
      <AuthDialog 
        open={authDialogOpen} 
        onClose={() => setAuthDialogOpen(false)} 
      />
    </AppBar>
  );
};

export default Navbar;