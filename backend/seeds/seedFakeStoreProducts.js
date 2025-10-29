import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../src/models/Product.js';
import connectDB from '../src/config/db.js';
import fetch from 'node-fetch';

dotenv.config();

const seedFakeStoreProducts = async () => {
  try {
    await connectDB();
    
    // Fetch products from Fake Store API
    console.log('Fetching products from Fake Store API...');
    const response = await fetch('https://fakestoreapi.com/products');
    if (!response.ok) {
      throw new Error(`Failed to fetch from Fake Store API: ${response.statusText}`);
    }
    
    const fakeStoreProducts = await response.json();
    
    // Clear existing products
    console.log('Clearing existing products...');
    await Product.deleteMany({});
    
    // Transform and insert the products
    const products = fakeStoreProducts.map(product => ({
      title: product.title,
      price: product.price,
      description: product.description,
      image: product.image,
      category: product.category,
      rating: {
        rate: product.rating.rate,
        count: product.rating.count
      }
    }));
    
    console.log('Inserting Fake Store products...');
    await Product.insertMany(products);
    
    console.log('Successfully seeded Fake Store products!');
    console.log(`Total products inserted: ${products.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedFakeStoreProducts();