import express from 'express';
import CartItem from '../models/CartItem.js';
import Product from '../models/Product.js';
import fetch from 'node-fetch';

const router = express.Router();

// Utility function to get product details from Fake Store API
async function getFakeStoreProduct(productId) {
  try {
    const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
    if (!response.ok) throw new Error('Product not found');
    const product = await response.json();
    return product;
  } catch (error) {
    console.error('Error fetching from Fake Store API:', error);
    return null;
  }
}

// @route   GET /api/cart
// @desc    Get cart items
router.get('/', async (req, res) => {
  try {
    const userId = 'default-user';
    
    const cartItems = await CartItem.find({ userId });
    console.log('Found cart items:', cartItems);
    
    if (!cartItems) {
      return res.json({ items: [], total: 0 });
    }
    
    // Since we now store complete product info in the cart item, we can return it directly
    const processedItems = cartItems.map(item => ({
      _id: item._id,
      product: item.product,
      quantity: item.quantity,
      userId: item.userId
    }));

    if (!Array.isArray(processedItems)) {
      throw new Error('Failed to process cart items');
    }

    // Calculate total (safely handle missing price)
    const total = processedItems.reduce((sum, item) => {
      const price = item.product?.price || 0;
      return sum + (price * item.quantity);
    }, 0);

    console.log('Sending response:', { items: processedItems, total });
    
    res.json({ 
      items: processedItems, 
      total: Number(total.toFixed(2))
    });
  } catch (error) {
    console.error('Cart fetch error:', error);
    res.status(500).json({ 
      message: 'Error fetching cart: ' + error.message,
      error: error.stack,
      items: [], 
      total: 0 
    });
  }
});

// @route   POST /api/cart
// @desc    Add item to cart or update quantity
router.post('/', async (req, res) => {
  try {
    const { product, quantity = 1, itemId } = req.body;
    const userId = 'default-user';

    // If itemId is provided, update existing cart item
    if (itemId) {
      const updatedItem = await CartItem.findByIdAndUpdate(
        itemId,
        { quantity },
        { new: true }
      );

      if (!updatedItem) {
        return res.status(404).json({ message: 'Cart item not found' });
      }

      // Get product details
      let productDetails = await Product.findById(updatedItem.product);
      if (!productDetails) {
        const fakeStoreProduct = await getFakeStoreProduct(updatedItem.product);
        if (fakeStoreProduct) {
          productDetails = {
            _id: fakeStoreProduct.id,
            name: fakeStoreProduct.title,
            price: fakeStoreProduct.price,
            description: fakeStoreProduct.description,
            image: fakeStoreProduct.image,
            category: fakeStoreProduct.category
          };
        }
      }

      return res.json({
        ...updatedItem.toObject(),
        product: productDetails
      });
    }

    console.log('Received request to add product:', product);

    // Validate required fields
    if (!product) {
      return res.status(400).json({ message: 'Product is required' });
    }

    // Format product data according to schema
    const productDetails = {
      id: product.id || 0,
      title: product.title || '',
      price: parseFloat(product.price) || 0,
      description: product.description || '',
      image: product.image || '',
      category: product.category || '',
      rating: product.rating || { rate: 0, count: 0 }
    };

    // Check if item already exists in cart for this user
    const existingCartItem = await CartItem.findOne({ 
      'product.id': product.id,
      userId: userId 
    });
    
    if (existingCartItem) {
      // Update quantity of existing item
      const updatedItem = await CartItem.findByIdAndUpdate(
        existingCartItem._id,
        { 
          $inc: { quantity: quantity }
        },
        { new: true }
      );
      
      return res.json({
        ...updatedItem.toObject()
      });
    }

    // Create new cart item
    const cartItem = new CartItem({
      product: productDetails,
      quantity,
      userId
    });

    try {
      await cartItem.save();
      console.log('Cart item saved successfully:', cartItem);

      res.status(201).json({
        ...cartItem.toObject(),
        product: productDetails
      });
    } catch (error) {
      console.error('Error saving cart item:', error);
      return res.status(500).json({ message: 'Error saving item to cart: ' + error.message });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   POST /api/cart
// @desc    Add item to cart or update quantity
router.post('/', async (req, res) => {
  try {
    const { quantity, itemId } = req.body;
    const userId = 'default-user';

    // If itemId is provided, update existing cart item
    if (itemId) {
      console.log('Updating quantity for cart item:', itemId, 'to:', quantity);
      
      if (typeof quantity !== 'number' || quantity < 1) {
        return res.status(400).json({ message: 'Invalid quantity' });
      }

      const cartItem = await CartItem.findById(itemId);
      if (!cartItem) {
        return res.status(404).json({ message: 'Cart item not found' });
      }

      // Update the quantity
      cartItem.quantity = quantity;
      await cartItem.save();

      // Recalculate cart total
      const allItems = await CartItem.find({ userId });
      const total = allItems.reduce((sum, item) => {
        const itemPrice = parseFloat(item.product.price) || 0;
        const itemQuantity = parseInt(item.quantity) || 0;
        return sum + (itemPrice * itemQuantity);
      }, 0);

      console.log('Updated cart total:', total);

      return res.json({
        item: cartItem,
        total: Number(total.toFixed(2))
      });
    }

    // If no itemId, treat as new item (existing code for adding new items)
    // ... rest of the existing code for adding new items ...
  } catch (error) {
    console.error('Cart operation error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/cart/:id
// @desc    Remove item from cart
router.delete('/:id', async (req, res) => {
  try {
    const cartItem = await CartItem.findByIdAndDelete(req.params.id);
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/cart/checkout
// @desc    Process checkout
router.post('/checkout', async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = 'default-user';
    const cartItems = await CartItem.find({ userId }).populate('product');
    const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    const receipt = {
      orderId: `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`.toUpperCase(),
      orderDate: new Date(),
      customerName: name,
      customerEmail: email,
      items: cartItems.map(item => ({
        _id: item._id,
        name: item.product.title || item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        subtotal: item.product.price * item.quantity,
        image: item.product.image,
        description: item.product.description
      })),
      totalAmount: Number(total.toFixed(2)),
      status: 'Confirmed'
    };

    // Clear cart after checkout for this user only
    await CartItem.deleteMany({ userId });
    
    res.json(receipt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;