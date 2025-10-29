import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Import routes
import productRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';

// Load env vars
dotenv.config();

const app = express();

// Server state
let isDbConnected = false;

// Connect to database
(async () => {
  try {
    await connectDB();
    console.log('Database connected successfully');
    isDbConnected = true;
  } catch (error) {
    console.error('Database connection failed:', error);
    // Don't exit, let the server start and retry connection
    isDbConnected = false;
  }
})();

// CORS configuration
app.use(cors({
  origin: ['https://vedant221005.github.io', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  optionsSuccessStatus: 200
}));

// Enable pre-flight requests for all routes
app.options('*', cors());

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});
app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  console.error('Error:', {
    statusCode,
    message,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
    stack: err.stack
  });

  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? {
      stack: err.stack,
      details: err.message
    } : 'Internal Server Error',
    dbStatus: isDbConnected ? 'connected' : 'disconnected'
  });
});

const PORT = process.env.PORT || 5001;

// Test database connection and start server
try {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('CORS enabled for:', ['https://vedant221005.github.io', 'http://localhost:5173']);
  });
} catch (error) {
  console.error('Failed to start server:', error);
  process.exit(1);
}