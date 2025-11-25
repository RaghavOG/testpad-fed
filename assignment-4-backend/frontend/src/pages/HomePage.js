import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Slider,
  Button,
  Pagination,
  CircularProgress,
  Alert,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from '@mui/material';
import {
  ExpandMore,
  FilterList,
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import axios from 'axios';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [maxPrice, setMaxPrice] = useState(1000);
  
  // Current filters
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [currentPriceRange, setCurrentPriceRange] = useState([0, 1000]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Fetch initial data
  useEffect(() => {
    fetchCategories();
    fetchBrands();
    fetchPriceRange();
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [currentPage, selectedCategory, selectedBrand, currentPriceRange, searchTerm, sortBy, sortOrder]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/products/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await axios.get('/api/products/brands');
      setBrands(response.data);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const fetchPriceRange = async () => {
    try {
      const response = await axios.get('/api/products/price-range');
      const { minPrice, maxPrice } = response.data;
      setPriceRange([minPrice, maxPrice]);
      setCurrentPriceRange([minPrice, maxPrice]);
      setMaxPrice(maxPrice);
    } catch (error) {
      console.error('Error fetching price range:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        sortBy,
        sortOrder,
      });
      
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedBrand) params.append('brand', selectedBrand);
      if (searchTerm) params.append('search', searchTerm);
      if (currentPriceRange[0] > priceRange[0]) params.append('minPrice', currentPriceRange[0].toString());
      if (currentPriceRange[1] < priceRange[1]) params.append('maxPrice', currentPriceRange[1].toString());
      
      const response = await axios.get(`/api/products?${params}`);
      setProducts(response.data.products);
      setTotalPages(response.data.pagination.totalPages);
      setTotalProducts(response.data.pagination.totalProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setCurrentPriceRange(priceRange);
    setSearchTerm('');
    setSortBy('createdAt');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeFiltersCount = [
    selectedCategory,
    selectedBrand,
    searchTerm,
    currentPriceRange[0] > priceRange[0] || currentPriceRange[1] < priceRange[1],
  ].filter(Boolean).length;

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        {/* Hero Section */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          sx={{
            textAlign: 'center',
            mb: 6,
            py: 6,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 3,
            color: 'white',
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              background: 'linear-gradient(45deg, #fff, #f0f0f0)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Discover Amazing Products
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            Find the perfect items at unbeatable prices
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.8, maxWidth: 600, mx: 'auto' }}>
            Shop from thousands of products across multiple categories. 
            Quality guaranteed, fast shipping, and excellent customer service.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Filters Sidebar */}
          <Grid item xs={12} md={3}>
            <Paper
              component={motion.div}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              sx={{ p: 3, mb: 3, position: 'sticky', top: 20 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FilterList sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Filters
                </Typography>
                {activeFiltersCount > 0 && (
                  <Chip
                    label={activeFiltersCount}
                    size="small"
                    color="primary"
                    sx={{ ml: 1 }}
                  />
                )}
              </Box>

              {activeFiltersCount > 0 && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ClearIcon />}
                  onClick={handleClearFilters}
                  sx={{ mb: 3, width: '100%' }}
                >
                  Clear All Filters
                </Button>
              )}

              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Search products"
                  variant="outlined"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    endAdornment: <SearchIcon color="action" />,
                  }}
                />
              </Box>

              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography sx={{ fontWeight: 600 }}>Category</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      label="Category"
                    >
                      <MenuItem value="">All Categories</MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography sx={{ fontWeight: 600 }}>Brand</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <FormControl fullWidth>
                    <InputLabel>Brand</InputLabel>
                    <Select
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                      label="Brand"
                    >
                      <MenuItem value="">All Brands</MenuItem>
                      {brands.map((brand) => (
                        <MenuItem key={brand} value={brand}>
                          {brand}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography sx={{ fontWeight: 600 }}>Price Range</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ px: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      ${currentPriceRange[0]} - ${currentPriceRange[1]}
                    </Typography>
                    <Slider
                      value={currentPriceRange}
                      onChange={(e, newValue) => setCurrentPriceRange(newValue)}
                      valueLabelDisplay="auto"
                      min={priceRange[0]}
                      max={priceRange[1]}
                      valueLabelFormat={(value) => `$${value}`}
                    />
                  </Box>
                </AccordionDetails>
              </Accordion>

              <Divider sx={{ my: 2 }} />

              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-');
                    setSortBy(field);
                    setSortOrder(order);
                  }}
                  label="Sort By"
                >
                  <MenuItem value="createdAt-desc">Newest First</MenuItem>
                  <MenuItem value="createdAt-asc">Oldest First</MenuItem>
                  <MenuItem value="price-asc">Price: Low to High</MenuItem>
                  <MenuItem value="price-desc">Price: High to Low</MenuItem>
                  <MenuItem value="rating-desc">Highest Rated</MenuItem>
                  <MenuItem value="name-asc">Name: A to Z</MenuItem>
                </Select>
              </FormControl>
            </Paper>
          </Grid>

          {/* Products Grid */}
          <Grid item xs={12} md={9}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Products ({totalProducts.toLocaleString()})
              </Typography>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress size={60} />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            ) : products.length === 0 ? (
              <Paper sx={{ p: 6, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  No products found matching your criteria.
                </Typography>
                <Button
                  variant="outlined"
                  onClick={handleClearFilters}
                  sx={{ mt: 2 }}
                >
                  Clear Filters
                </Button>
              </Paper>
            ) : (
              <>
                <Grid container spacing={3}>
                  <AnimatePresence>
                    {products.map((product, index) => (
                      <Grid item xs={12} sm={6} lg={4} key={product._id}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          layout
                        >
                          <ProductCard product={product} />
                        </motion.div>
                      </Grid>
                    ))}
                  </AnimatePresence>
                </Grid>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={handlePageChange}
                      color="primary"
                      size="large"
                      showFirstButton
                      showLastButton
                    />
                  </Box>
                )}
              </>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;