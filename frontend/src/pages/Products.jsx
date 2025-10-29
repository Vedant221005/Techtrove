import { useState, useEffect } from 'react';
import { ProductCard } from '../components/ProductCard';
import { ProductSkeleton } from '../components/ProductSkeleton';
import { useUser } from '../lib/userContext.jsx';
import { toast } from 'sonner';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useUser();

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setError(null);
      setLoading(true);
      
      // Try fetching from Fake Store API directly
      const response = await fetch('https://fakestoreapi.com/products', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (!response.ok) {
        throw new Error(`Error fetching products: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched products:', data);
      
      // Ensure we have an array of products
      if (Array.isArray(data)) {
        console.log('Fetched products:', data);
        setProducts(data);
      } else {
        console.error('Invalid data format:', data);
        setProducts([]);
        setError('Invalid data received from server');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products. Please try again later.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddToCart(product) {
    try {
      console.log('Adding product to cart:', product);
      const apiUrl = 'https://techtrove-uspn.onrender.com';
      console.log('Using API URL:', apiUrl);
      
      const cartData = {
        quantity: 1,
        product: {
          id: parseInt(product.id),
          title: product.title,
          price: parseFloat(product.price),
          description: product.description || '',
          image: product.image || '',
          category: product.category || '',
          rating: product.rating || { rate: 0, count: 0 }
        }
      };
      
      console.log('Sending cart data:', cartData);
      
      const response = await fetch(`${apiUrl}/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cartData),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        let errorMessage = 'Failed to add to cart';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If we can't parse the error as JSON, use the status text
          errorMessage = `${errorMessage}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      
      const responseData = await response.json();
      console.log('Success response:', responseData);
      
      toast.success('Added to Cart', {
        description: `${product.title || product.name} has been added to your cart.`
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to Add Item', {
        description: error.message || 'There was a problem adding this item to your cart. Please try again.',
      });
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-start justify-center bg-gradient-to-b from-blue-50 via-blue-100 to-white dark:from-slate-900 dark:via-indigo-900 dark:to-slate-950 transition-colors duration-500 py-10">
        <div className="relative z-10 w-full max-w-6xl bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl p-8 md:p-12">
          <div className="w-48 h-8 bg-gray-200 dark:bg-gray-800 rounded mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[...Array(6)].map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-start justify-center bg-gradient-to-b from-blue-50 via-blue-100 to-white dark:from-slate-900 dark:via-indigo-900 dark:to-slate-950 transition-colors duration-500 py-10">
      <div className="relative z-10 w-full max-w-6xl bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl p-8 md:p-12">
        <h1 className="mb-8 text-3xl font-bold text-primary">Our Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {error ? (
            <div className="col-span-full text-center py-8">
              <p className="text-red-500 dark:text-red-400">{error}</p>
              <button
                onClick={fetchProducts}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Try Again
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No products available at the moment.
            </div>
          ) : (
            products.map((product) => (
              <ProductCard
                key={product.id || product._id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}