import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Link,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Store,
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'grey.900',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Store sx={{ mr: 1, color: 'primary.main', fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                ShopHub
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2, color: 'grey.400' }}>
              Your one-stop destination for premium products at unbeatable prices. 
              Discover amazing deals and shop with confidence.
            </Typography>
            <Box>
              <IconButton sx={{ color: 'grey.400', '&:hover': { color: 'primary.main' } }}>
                <Facebook />
              </IconButton>
              <IconButton sx={{ color: 'grey.400', '&:hover': { color: 'primary.main' } }}>
                <Twitter />
              </IconButton>
              <IconButton sx={{ color: 'grey.400', '&:hover': { color: 'primary.main' } }}>
                <Instagram />
              </IconButton>
              <IconButton sx={{ color: 'grey.400', '&:hover': { color: 'primary.main' } }}>
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="#" color="inherit" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                About Us
              </Link>
              <Link href="#" color="inherit" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                Contact
              </Link>
              <Link href="#" color="inherit" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                FAQ
              </Link>
              <Link href="#" color="inherit" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                Shipping Info
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Categories
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="#" color="inherit" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                Electronics
              </Link>
              <Link href="#" color="inherit" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                Clothing
              </Link>
              <Link href="#" color="inherit" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                Home & Garden
              </Link>
              <Link href="#" color="inherit" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                Sports
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Customer Service
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="#" color="inherit" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                Return Policy
              </Link>
              <Link href="#" color="inherit" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                Privacy Policy
              </Link>
              <Link href="#" color="inherit" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                Terms of Service
              </Link>
              <Link href="#" color="inherit" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                Support
              </Link>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, bgcolor: 'grey.700' }} />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="grey.400">
            © {new Date().getFullYear()} ShopHub. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;