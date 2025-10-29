import express from 'express';
import Product from '../models/Product.js';
import fetch from 'node-fetch';

const router = express.Router();
let lastFetch = null;
let cachedProducts = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function fetchFromFakeStore() {
  try {
    console.log('Fetching from Fake Store API...');
    const response = await fetch('https://fakestoreapi.com/products', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      console.error(`Fake Store API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('Invalid JSON from Fake Store API:', text);
      return null;
    }

    console.log(`Fetched ${Array.isArray(data) ? data.length : 0} products from Fake Store API`);
    
    if (!Array.isArray(data)) {
      throw new Error('Invalid data format from Fake Store API');
    }

    // Transform data to match our schema while preserving the id
    const transformedData = data.map(item => ({
      id: item.id,
      title: item.title,
      price: item.price,
      description: item.description,
      image: item.image,
      category: item.category,
      rating: item.rating
    }));

    return transformedData;
  } catch (error) {
    console.error('Fake Store API Error:', error.message);
    return [];
  }
}

async function getProducts() {
  // Check cache first
  const now = Date.now();
  if (cachedProducts && lastFetch && (now - lastFetch < CACHE_DURATION)) {
    return cachedProducts;
  }

  try {
    // Try Fake Store API first
    const fakeStoreProducts = await fetchFromFakeStore();
    
    if (fakeStoreProducts) {
      // Update the database with Fake Store products
      await Product.deleteMany({}); // Clear existing products
      await Product.insertMany(fakeStoreProducts);
      
      // Update cache
      cachedProducts = fakeStoreProducts;
      lastFetch = now;
      return fakeStoreProducts;
    }

    // Fallback to database if API fails
    const dbProducts = await Product.find({});
    if (dbProducts.length > 0) {
      cachedProducts = dbProducts;
      lastFetch = now;
      return dbProducts;
    }

    throw new Error('No products available');
  } catch (error) {
    throw error;
  }
}

// @route   GET /api/products
// @desc    Get all products with Fake Store API integration
router.get('/', async (req, res) => {
  try {
    console.log('Handling /api/products request...');
    
    // Try to fetch directly from Fake Store API first
    const fakeStoreProducts = await fetchFromFakeStore();
    
    if (fakeStoreProducts && Array.isArray(fakeStoreProducts) && fakeStoreProducts.length > 0) {
      console.log('Successfully fetched products from Fake Store API');
      return res.json(fakeStoreProducts);
    }
    
    console.log('Falling back to database products...');
    // Fall back to database if Fake Store API fails
    const dbProducts = await Product.find({});
    
    if (dbProducts && dbProducts.length > 0) {
      console.log('Successfully fetched products from database');
      return res.json(dbProducts);
    }
    
    console.log('No products found in either source');
    return res.json([]);
  } catch (error) {
    console.error('Products fetch error:', error);
    res.status(500).json({ 
      message: 'Error fetching products',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

export default router;