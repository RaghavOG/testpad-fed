# ShopHub - Quick Start Guide

## 🚀 Quick Setup (Windows)

### Option 1: Automated Setup
1. Double-click `start.bat` to automatically install dependencies and start both servers
2. The script will:
   - Install all dependencies
   - Seed the database with sample data
   - Start backend server on http://localhost:5000
   - Start frontend app on http://localhost:3000

### Option 2: Manual Setup

#### Prerequisites
- Node.js (v14+): https://nodejs.org/
- MongoDB: https://www.mongodb.com/try/download/community
- Git: https://git-scm.com/

#### Step 1: Install Dependencies
```bash
# Install all dependencies at once
npm run install-all

# OR install separately:
cd backend && npm install
cd ../frontend && npm install
```

#### Step 2: Setup Database
```bash
# Start MongoDB service (Windows)
net start MongoDB

# Seed database with sample products
npm run seed
```

#### Step 3: Start Application
```bash
# Start both frontend and backend
npm run dev

# OR start separately:
npm run server  # Backend only
npm run client  # Frontend only
```

## 🌐 Application URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Docs**: http://localhost:5000/api/products

## 📊 Sample Data

The application comes with 100+ sample products across 8 categories:
- Electronics (smartphones, laptops, headphones)
- Clothing (shoes, shirts, jeans)
- Books (novels, guides, textbooks)
- Home & Garden (furniture, decor, tools)
- Sports (equipment, apparel, accessories)
- Beauty (makeup, skincare, perfumes)
- Toys (games, educational toys, collectibles)
- Automotive (parts, tools, accessories)

## 🔧 Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**
   ```bash
   # Start MongoDB service
   net start MongoDB
   
   # Or install MongoDB if not installed
   # Visit: https://www.mongodb.com/try/download/community
   ```

2. **Port Already in Use**
   ```bash
   # Kill process on port 3000 or 5000
   npx kill-port 3000
   npx kill-port 5000
   ```

3. **Dependencies Not Installing**
   ```bash
   # Clear npm cache
   npm cache clean --force
   
   # Delete node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

## 🎯 Key Features Implemented

### ✅ Phase 1 Requirements
- [x] Full Stack Application (React + Node.js + MongoDB)
- [x] Mongoose Product Model with comprehensive schema
- [x] Database populated with 100+ products
- [x] Home page displaying 20 products per page
- [x] Pagination for browsing all products
- [x] Filters: Category, Price, Brand, Search
- [x] Modern, responsive design template
- [x] Complete E-commerce functionality
- [x] RESTful API endpoints
- [x] Shopping cart functionality
- [x] Product details pages
- [x] Mobile-responsive design

### 🎨 Design Features
- Modern Material-UI components
- Smooth animations with Framer Motion
- Gradient backgrounds and glassmorphism effects
- Responsive grid layout
- Interactive hover effects
- Loading states and error handling

### 🔍 Filtering & Search
- **Category Filter**: 8 different categories
- **Brand Filter**: Multiple brand options
- **Price Range**: Slider for min/max price
- **Text Search**: Search in name, description, brand
- **Sorting**: Price, rating, name, date
- **Advanced Filters**: Featured products, stock status

### 🛒 E-commerce Features
- Add to cart functionality
- Quantity management
- Persistent cart (localStorage)
- Cart total calculation
- Product specifications display
- Image gallery for products
- Stock status indicators
- Discount badges

## 📈 Performance Optimizations

- Lazy loading and code splitting
- Efficient state management with Context API
- Optimized database queries with indexing
- Image optimization and caching
- Responsive design for all devices

## 🔄 Git Workflow

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit changes
git commit -m "feat: Complete Phase-1 E-commerce Application

- Implement full-stack architecture with React + Node.js + MongoDB
- Add comprehensive product catalog with 100+ items
- Create advanced filtering and search functionality
- Build responsive shopping cart system
- Design modern UI with Material-UI and animations
- Set up RESTful API with pagination and filtering
- Implement product details and cart management
- Add database seeding and sample data"

# Add remote origin (replace with your GitHub repo URL)
git remote add origin https://github.com/yourusername/shophub-ecommerce.git

# Push to GitHub
git push -u origin main
```

## 🎯 Next Steps (Future Phases)

### Phase 2 Ideas:
- User authentication and profiles
- Order management system
- Payment integration (Stripe/PayPal)
- Admin dashboard for product management
- Product reviews and ratings system

### Phase 3 Ideas:
- Advanced recommendation engine
- Multi-vendor marketplace
- Real-time notifications
- Mobile app development
- Advanced analytics dashboard

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Ensure all prerequisites are installed
3. Check that MongoDB is running
4. Verify all dependencies are installed correctly

---

**Happy Coding! 🚀**