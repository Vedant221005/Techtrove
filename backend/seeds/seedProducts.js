import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../src/models/Product.js';
import connectDB from '../src/config/db.js';

dotenv.config();

const products = [
  {
    title: 'Wireless Earbuds',
    price: 99.99,
    description: 'High-quality wireless earbuds with noise cancellation',
    image: 'https://m.media-amazon.com/images/I/41V22K7ad-L._SY300_SX300_QL70_FMwebp_.jpg',
    category: 'Electronics',
    rating: { rate: 4.5, count: 89 }
  },
  {
    title: 'Smart Watch',
    price: 199.99,
    description: 'Feature-rich smartwatch with health tracking',
    image: 'https://m.media-amazon.com/images/I/61pIzNaNRWL.jpg',
    category: 'Electronics',
    rating: { rate: 4.3, count: 120 }
  },
  {
    title: 'Laptop Backpack',
    price: 49.99,
    description: 'Water-resistant laptop backpack with multiple compartments',
    image: 'https://redhorns.in/cdn/shop/files/Artboard1.jpg?v=1705495335&width=2048',
    category: 'Accessories',
    rating: { rate: 4.8, count: 230 }
  },
  {
    title: 'Coffee Maker',
    price: 79.99,
    description: 'Programmable coffee maker with thermal carafe',
    image: 'https://www.wonderchef.com/cdn/shop/files/6809756.jpg?v=1757415602',
    category: 'Home & Kitchen',
    rating: { rate: 4.2, count: 156 }
  },
  {
    title: 'Bluetooth Speaker',
    price: 129.99,
    description: 'Portable Bluetooth speaker with 20-hour battery life',
    image: 'https://avstore.in/cdn/shop/files/2.AVStore-JBL-PartyBox-110-160W-Portable-Wireless-Speaker-Front-Left-Angled-View.jpg?v=1682411625&width=2000',
    category: 'Electronics',
    rating: { rate: 4.6, count: 198 }
  }
];

const seedProducts = async () => {
  try {
    await connectDB();
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('Products seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedProducts();