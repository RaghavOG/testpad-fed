import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  Avatar,
  Rating,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Person,
  Edit,
  Add,
  LocationOn,
  Phone,
  Email,
  Favorite,
  ShoppingCart,
  History,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, updateProfile, addAddress, updateAddress, deleteAddress } = useAuth();
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth || '',
    gender: user?.gender || '',
  });

  const [addressData, setAddressData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    phone: '',
    isDefault: false,
  });

  // Load user orders and wishlist
  useEffect(() => {
    if (user) {
      loadOrders();
      loadWishlist();
    }
  }, [user]);

  const loadOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders/my-orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders.slice(0, 5)); // Show only recent orders
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const loadWishlist = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/wishlist', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setWishlist(data.wishlist.slice(0, 4)); // Show only few items
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
    }
  };

  const handleProfileUpdate = async () => {
    setLoading(true);
    setError('');
    
    const result = await updateProfile(profileData);
    
    if (result.success) {
      setSuccess('Profile updated successfully!');
      setEditDialogOpen(false);
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const handleAddAddress = async () => {
    setLoading(true);
    setError('');
    
    const result = await addAddress(addressData);
    
    if (result.success) {
      setSuccess('Address added successfully!');
      setAddressDialogOpen(false);
      setAddressData({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA',
        phone: '',
        isDefault: false,
      });
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address._id);
    setAddressData({
      firstName: address.firstName,
      lastName: address.lastName,
      address: address.address,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      phone: address.phone,
      isDefault: address.isDefault,
    });
    setAddressDialogOpen(true);
  };

  const handleUpdateAddress = async () => {
    setLoading(true);
    setError('');
    
    const result = await updateAddress(editingAddress, addressData);
    
    if (result.success) {
      setSuccess('Address updated successfully!');
      setAddressDialogOpen(false);
      setEditingAddress(null);
      setAddressData({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA',
        phone: '',
        isDefault: false,
      });
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      const result = await deleteAddress(addressId);
      if (result.success) {
        setSuccess('Address deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.message);
      }
    }
  };

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Typography variant="h6">Please login to view your profile</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Information */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ width: 60, height: 60, mr: 2 }}>
                <Person />
              </Avatar>
              <Box>
                <Typography variant="h6">
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
                <Chip 
                  label={user.role === 'admin' ? 'Admin' : 'Customer'} 
                  color="primary" 
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>
            </Box>
            
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Edit />}
              onClick={() => setEditDialogOpen(true)}
            >
              Edit Profile
            </Button>
          </Paper>
        </Grid>

        {/* Addresses */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Addresses</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setAddressDialogOpen(true)}
              >
                Add Address
              </Button>
            </Box>
            
            {user.addresses && user.addresses.length > 0 ? (
              <Grid container spacing={2}>
                {user.addresses.map((address) => (
                  <Grid item xs={12} sm={6} key={address._id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography variant="subtitle2">
                            {address.firstName} {address.lastName}
                            {address.isDefault && (
                              <Chip label="Default" color="primary" size="small" sx={{ ml: 1 }} />
                            )}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {address.address}<br />
                          {address.city}, {address.state} {address.zipCode}<br />
                          {address.country}
                          {address.phone && <><br />📞 {address.phone}</>}
                        </Typography>
                        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                          <Button
                            size="small"
                            onClick={() => handleEditAddress(address)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleDeleteAddress(address._id)}
                          >
                            Delete
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography color="text.secondary">No addresses added yet</Typography>
            )}
          </Paper>
        </Grid>

        {/* Recent Orders */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Orders
            </Typography>
            {orders.length > 0 ? (
              <List>
                {orders.map((order) => (
                  <ListItem key={order._id}>
                    <ListItemAvatar>
                      <Avatar>
                        <History />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`Order #${order.orderNumber}`}
                      secondary={
                        <Box>
                          <Typography variant="body2">
                            Status: <Chip label={order.orderStatus} size="small" />
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Total: ${order.totalPrice.toFixed(2)}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">No orders yet</Typography>
            )}
          </Paper>
        </Grid>

        {/* Wishlist */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Wishlist
            </Typography>
            {wishlist.length > 0 ? (
              <Grid container spacing={1}>
                {wishlist.map((product) => (
                  <Grid item xs={6} key={product._id}>
                    <Card sx={{ cursor: 'pointer' }}>
                      <Box sx={{ position: 'relative' }}>
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          style={{ width: '100%', height: 120, objectFit: 'cover' }}
                        />
                        <Favorite
                          sx={{ position: 'absolute', top: 8, right: 8, color: 'red' }}
                        />
                      </Box>
                      <CardContent sx={{ p: 1 }}>
                        <Typography variant="caption" noWrap>
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="primary">
                          ${product.price}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography color="text.secondary">No items in wishlist</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="First Name"
                value={profileData.firstName}
                onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={profileData.lastName}
                onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleProfileUpdate} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Address Dialog */}
      <Dialog open={addressDialogOpen} onClose={() => setAddressDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingAddress ? 'Edit Address' : 'Add New Address'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="First Name"
                value={addressData.firstName}
                onChange={(e) => setAddressData({ ...addressData, firstName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={addressData.lastName}
                onChange={(e) => setAddressData({ ...addressData, lastName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={addressData.address}
                onChange={(e) => setAddressData({ ...addressData, address: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="City"
                value={addressData.city}
                onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                label="State"
                value={addressData.state}
                onChange={(e) => setAddressData({ ...addressData, state: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                label="ZIP Code"
                value={addressData.zipCode}
                onChange={(e) => setAddressData({ ...addressData, zipCode: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Phone"
                value={addressData.phone}
                onChange={(e) => setAddressData({ ...addressData, phone: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddressDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={editingAddress ? handleUpdateAddress : handleAddAddress}
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : (editingAddress ? 'Update' : 'Add')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfilePage;