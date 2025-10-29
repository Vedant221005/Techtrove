import { useState } from 'react';
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { useUser } from '../lib/userContext';
import { useNavigate } from 'react-router-dom';

/**
 * Renders a stylized product card component.
 * @param {object} product - The product object data.
 * @param {function} onAddToCart - Handler for adding the product to the cart.
 */
export function ProductCard({ product, onAddToCart }) {
  const [isAdding, setIsAdding] = useState(false);

  const { user } = useUser();
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please Login', {
        description: 'You need to login to add items to cart',
        action: {
          label: 'Login',
          onClick: () => navigate('/login')
        }
      });
      return;
    }

    setIsAdding(true);
    try {
      // Pass the complete product data and ensure we send the id
      await onAddToCart({
        ...product,
        _id: product.id, // Keep both id and _id for compatibility
        id: product.id,  // Ensure id is present
        isFakeStore: true
      });
    } finally {
      setIsAdding(false);
    }
  };
  // Use placeholder image if product.image is not defined or null
  const imageUrl = product.image || 'https://via.placeholder.com/400x300?text=Product+Image';
  
  return (
    // Card Container: Enhanced border, shadow, and a subtle hover effect
    <div className="
      rounded-xl border-2 border-transparent hover:border-primary
      bg-white dark:bg-gray-900 
      shadow-lg hover:shadow-2xl hover:shadow-primary/20 
      transition-all duration-300 ease-in-out transform hover:-translate-y-1
      group
    ">
      
      {/* Product Image Section */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-xl">
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 animate-pulse"></div>
        <img
          src={imageUrl}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-contain bg-white dark:bg-gray-900 transition-transform duration-500 group-hover:scale-102"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=Product+Image';
          }}
          loading="lazy"
        />
        {/* Hover overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      {/* Product Details Section */}
      <div className="p-5 md:p-6 space-y-3">
        
        {/* Category Tag */}
        <div className="mb-2">
          <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>
        
        {/* Name and Description */}
        <h3 className="text-xl font-bold truncate text-gray-900 dark:text-white group-hover:text-primary transition-colors">
          {product.title || product.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 min-h-[40px]">
          {product.description}
        </p>
        
        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(product.rating.rate)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-500">
              ({product.rating.count} reviews)
            </span>
          </div>
        )}
        
        {/* Price and Action Button */}
        <div className="mt-5 flex items-end justify-between pt-2 border-t border-dashed border-gray-200 dark:border-gray-700">
          
          {/* Price Tag with emphasis */}
          <div>
            <span className="text-sm font-medium text-muted-foreground block">Price</span>
            <span className="text-2xl font-extrabold text-primary">₹{product.price.toFixed(2)}</span>
          </div>
          
          {/* Add to Cart Button with animation */}
          <Button
            onClick={handleAddToCart}
            className="text-base px-6 py-2 btn-primary shadow-lg hover:shadow-xl transition-shadow duration-300"
            disabled={isAdding}
          >
            {isAdding ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </>
            ) : (
              '+ Add to Cart'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}