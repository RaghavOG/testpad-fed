# ShopHub - Full Stack E-commerce Application

A modern, responsive e-commerce application built with React.js frontend and Node.js backend with MongoDB database.

## 🚀 Features

### Frontend Features
- **Modern UI/UX**: Beautiful, responsive design with Material-UI and Framer Motion animations
- **Product Catalog**: Display products with pagination (20 products per page)
- **Advanced Filtering**: Filter by category, brand, price range, and search
- **Product Details**: Detailed product pages with specifications and image gallery
- **Shopping Cart**: Add/remove items, update quantities, persistent cart storage
- **Responsive Design**: Optimized for mobile, tablet, and desktop devices

### Backend Features
- **RESTful API**: Well-structured API endpoints for all operations
- **MongoDB Integration**: Efficient data storage with Mongoose ODM
- **Product Management**: CRUD operations for products
- **Advanced Querying**: Search, filter, sort, and paginate products
- **Data Seeding**: Automated database population with sample data

### Technical Features
- **React 18**: Latest React features with functional components and hooks
- **Material-UI**: Modern component library with custom theming
- **Framer Motion**: Smooth animations and transitions
- **Express.js**: Fast and minimal web framework
- **MongoDB**: NoSQL database for flexible data storage
- **Axios**: HTTP client for API communication

## 📦 Project Structure

```
assignment-4-backend/
├── backend/
│   ├── models/
│   │   └── Product.js          # Product mongoose model
│   ├── routes/
│   │   └── products.js         # Product API routes
│   ├── server.js               # Express server setup
│   ├── seedData.js             # Database seeding script
│   ├── package.json            # Backend dependencies
│   └── .env                    # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js       # Navigation component
│   │   │   ├── Footer.js       # Footer component
│   │   │   └── ProductCard.js  # Product display component
│   │   ├── pages/
│   │   │   ├── HomePage.js     # Main products page
│   │   │   ├── ProductPage.js  # Product details page
│   │   │   └── CartPage.js     # Shopping cart page
│   │   ├── context/
│   │   │   └── CartContext.js  # Cart state management
│   │   ├── App.js              # Main app component
│   │   └── index.js            # React entry point
│   ├── public/
│   │   └── index.html          # HTML template
│   └── package.json            # Frontend dependencies
└── README.md                   # Project documentation
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file with your MongoDB connection:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   NODE_ENV=development
   ```

4. Start MongoDB service

5. Seed the database with sample data:
   ```bash
   npm run seed
   ```

6. Start the backend server:
   ```bash
   npm run dev
   ```
   Server will run on http://localhost:5000

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```
   Application will run on http://localhost:3000

## 🌐 API Endpoints

### Products
- `GET /api/products` - Get all products with filtering, sorting, and pagination
  - Query parameters:
    - `page` - Page number (default: 1)
    - `limit` - Items per page (default: 20)
    - `category` - Filter by category
    - `brand` - Filter by brand
    - `minPrice` - Minimum price filter
    - `maxPrice` - Maximum price filter
    - `search` - Text search in name, description, brand
    - `sortBy` - Sort field (price, rating, createdAt, name)
    - `sortOrder` - Sort order (asc, desc)

- `GET /api/products/:id` - Get single product by ID
- `GET /api/products/categories` - Get all unique categories
- `GET /api/products/brands` - Get all unique brands
- `GET /api/products/price-range` - Get min and max price range
- `POST /api/products` - Create new product (admin)

## 🎨 Design Features

### Modern UI Elements
- **Gradient Backgrounds**: Beautiful color gradients throughout the app
- **Glassmorphism**: Frosted glass effect on cards and modals
- **Smooth Animations**: Page transitions and hover effects
- **Responsive Grid**: Adaptive layout for all screen sizes
- **Interactive Elements**: Buttons with hover states and loading indicators

### Color Palette
- **Primary**: Blue shades (#2563eb, #3b82f6)
- **Secondary**: Amber shades (#f59e0b, #fbbf24)
- **Background**: Light grays (#f8fafc, #ffffff)
- **Text**: Balanced contrast ratios for accessibility

## 📱 Responsive Design

The application is fully responsive with breakpoints for:
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: 1024px and above

## 🔧 Development Features

### Code Quality
- **ES6+ Syntax**: Modern JavaScript features
- **Component Architecture**: Reusable React components
- **State Management**: Context API for cart state
- **Error Handling**: Proper error states and user feedback
- **Loading States**: Skeleton screens and spinners

### Performance Optimizations
- **Lazy Loading**: Code splitting for better performance
- **Memoization**: Preventing unnecessary re-renders
- **Image Optimization**: Proper image sizing and loading
- **API Caching**: Efficient data fetching strategies

## 🚦 Usage

1. **Browse Products**: View products on the homepage with filtering options
2. **Search & Filter**: Use the sidebar filters to find specific products
3. **Product Details**: Click on any product to view detailed information
4. **Add to Cart**: Add products to cart and manage quantities
5. **Cart Management**: View cart, update quantities, and proceed to checkout

## 🔮 Future Enhancements

- User authentication and profiles
- Order management system
- Payment integration (Stripe/PayPal)
- Product reviews and ratings
- Wishlist functionality
- Admin dashboard
- Email notifications
- Inventory management
- Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- Material-UI for the component library
- Framer Motion for animations
- Unsplash for placeholder images
- MongoDB for database solutions
- Express.js for the web framework