const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const sampleProducts = [
  {
    name: "iPhone 15 Pro Max",
    description: "The most advanced iPhone yet with titanium design, A17 Pro chip, and pro camera system.",
    price: 1199.99,
    originalPrice: 1299.99,
    category: "Electronics",
    brand: "Apple",
    imageUrl: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop"
    ],
    stock: 50,
    rating: 4.8,
    numReviews: 324,
    featured: true,
    tags: ["smartphone", "premium", "5G", "camera"],
    specifications: new Map([
      ["Storage", "256GB"],
      ["RAM", "8GB"],
      ["Display", "6.7-inch Super Retina XDR"],
      ["Camera", "48MP Triple Camera"]
    ])
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    description: "Ultimate Android flagship with S Pen, 200MP camera, and AI-powered features.",
    price: 1099.99,
    category: "Electronics",
    brand: "Samsung",
    imageUrl: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&h=500&fit=crop",
    stock: 35,
    rating: 4.7,
    numReviews: 256,
    featured: true,
    tags: ["smartphone", "android", "S Pen", "camera"],
    specifications: new Map([
      ["Storage", "512GB"],
      ["RAM", "12GB"],
      ["Display", "6.8-inch Dynamic AMOLED 2X"],
      ["Camera", "200MP Quad Camera"]
    ])
  },
  {
    name: "MacBook Pro 14-inch M3",
    description: "Supercharged by M3 chip for incredible performance in a compact design.",
    price: 1999.99,
    category: "Electronics",
    brand: "Apple",
    imageUrl: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=500&fit=crop",
    stock: 25,
    rating: 4.9,
    numReviews: 189,
    featured: true,
    tags: ["laptop", "professional", "M3", "portable"],
    specifications: new Map([
      ["Processor", "Apple M3 8-core CPU"],
      ["Memory", "16GB unified memory"],
      ["Storage", "512GB SSD"],
      ["Display", "14.2-inch Liquid Retina XDR"]
    ])
  },
  {
    name: "Nike Air Jordan 1 Retro High",
    description: "Classic basketball sneaker with premium leather and iconic design.",
    price: 170.00,
    category: "Clothing",
    brand: "Nike",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
    stock: 120,
    rating: 4.6,
    numReviews: 892,
    featured: false,
    tags: ["sneakers", "basketball", "retro", "leather"],
    specifications: new Map([
      ["Material", "Premium Leather"],
      ["Sole", "Rubber"],
      ["Closure", "Lace-up"],
      ["Style", "High-top"]
    ])
  },
  {
    name: "Sony WH-1000XM5 Headphones",
    description: "Industry-leading noise canceling wireless headphones with crystal clear hands-free calling.",
    price: 399.99,
    originalPrice: 449.99,
    category: "Electronics",
    brand: "Sony",
    imageUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=500&fit=crop",
    stock: 75,
    rating: 4.8,
    numReviews: 567,
    featured: true,
    tags: ["headphones", "wireless", "noise-canceling", "premium"],
    specifications: new Map([
      ["Battery Life", "30 hours"],
      ["Connectivity", "Bluetooth 5.2"],
      ["Drivers", "30mm"],
      ["Weight", "250g"]
    ])
  },
  {
    name: "Levi's 501 Original Jeans",
    description: "The original straight fit jean with a classic look that never goes out of style.",
    price: 89.99,
    category: "Clothing",
    brand: "Levi's",
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop",
    stock: 200,
    rating: 4.4,
    numReviews: 1234,
    featured: false,
    tags: ["jeans", "denim", "classic", "straight-fit"],
    specifications: new Map([
      ["Fit", "Straight"],
      ["Material", "100% Cotton"],
      ["Rise", "Mid-rise"],
      ["Closure", "Button fly"]
    ])
  },
  // Add more products...
];

// Generate more products programmatically
const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Beauty', 'Toys', 'Automotive'];
const brands = ['Apple', 'Samsung', 'Nike', 'Adidas', 'Sony', 'LG', 'Microsoft', 'Google', 'Amazon', 'Dell'];
const adjectives = ['Premium', 'Professional', 'Classic', 'Modern', 'Stylish', 'Advanced', 'Innovative', 'Comfortable', 'Durable', 'Elegant'];
const productTypes = {
  'Electronics': ['Smartphone', 'Laptop', 'Tablet', 'Headphones', 'Speaker', 'Camera', 'Monitor', 'Keyboard'],
  'Clothing': ['T-Shirt', 'Jeans', 'Sneakers', 'Jacket', 'Dress', 'Hoodie', 'Shorts', 'Boots'],
  'Books': ['Novel', 'Cookbook', 'Biography', 'Manual', 'Textbook', 'Guide', 'Dictionary', 'Atlas'],
  'Home & Garden': ['Chair', 'Table', 'Lamp', 'Vase', 'Plant', 'Tool', 'Decor', 'Storage'],
  'Sports': ['Ball', 'Equipment', 'Gear', 'Shoes', 'Apparel', 'Accessory', 'Tool', 'Device'],
  'Beauty': ['Cream', 'Serum', 'Makeup', 'Perfume', 'Brush', 'Tool', 'Kit', 'Set'],
  'Toys': ['Action Figure', 'Board Game', 'Puzzle', 'Doll', 'Building Set', 'Educational Toy', 'Remote Control', 'Plush'],
  'Automotive': ['Tool', 'Part', 'Accessory', 'Fluid', 'Component', 'Kit', 'Device', 'Equipment']
};

// Generate additional products
for (let i = 0; i < 100; i++) {
  const category = categories[Math.floor(Math.random() * categories.length)];
  const brand = brands[Math.floor(Math.random() * brands.length)];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const productType = productTypes[category][Math.floor(Math.random() * productTypes[category].length)];
  
  const basePrice = Math.floor(Math.random() * 500) + 10;
  const hasDiscount = Math.random() > 0.7;
  const originalPrice = hasDiscount ? basePrice + Math.floor(Math.random() * 100) : null;
  
  sampleProducts.push({
    name: `${adjective} ${brand} ${productType}`,
    description: `High-quality ${productType.toLowerCase()} from ${brand} with premium features and excellent build quality.`,
    price: basePrice,
    originalPrice: originalPrice,
    category: category,
    brand: brand,
    imageUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=500&h=500&fit=crop&auto=format`,
    stock: Math.floor(Math.random() * 100) + 10,
    rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // Random rating between 3.0 and 5.0
    numReviews: Math.floor(Math.random() * 500) + 10,
    featured: Math.random() > 0.8,
    tags: [productType.toLowerCase(), brand.toLowerCase(), category.toLowerCase()],
    specifications: new Map([
      ["Brand", brand],
      ["Category", category],
      ["Model", `${productType}-${Math.floor(Math.random() * 1000)}`],
      ["Warranty", "1 Year"]
    ])
  });
}

const seedDatabase = async () => {
  try {
    console.log('Clearing existing products...');
    await Product.deleteMany({});
    
    console.log('Inserting sample products...');
    await Product.insertMany(sampleProducts);
    
    console.log(`Successfully seeded ${sampleProducts.length} products!`);
    
    // Display some stats
    const totalProducts = await Product.countDocuments();
    const categories = await Product.distinct('category');
    const brands = await Product.distinct('brand');
    
    console.log(`Total products: ${totalProducts}`);
    console.log(`Categories: ${categories.join(', ')}`);
    console.log(`Brands: ${brands.length} unique brands`);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
  }
};

seedDatabase();