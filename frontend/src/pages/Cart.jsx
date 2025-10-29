import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { CartItem } from '../components/CartItem';
import { useUser } from '../lib/userContext.jsx';

export default function Cart() {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { userId } = useUser();

  useEffect(() => {
    fetchCart();
  }, []);

  async function fetchCart() {
    try {
      setError(null);
      setLoading(true);
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      console.log('Fetching cart from:', `${apiUrl}/api/cart`);
      
      const response = await fetch(`${apiUrl}/api/cart`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'omit' // Don't send credentials
      });
      
      console.log('Cart fetch response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Cart fetch error response:', errorText);
        throw new Error(`Failed to fetch cart: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Cart data received:', data);
      setCart(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError(error.message);
      setCart({ items: [], total: 0 });
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateQuantity(itemId, newQuantity) {
    console.log('Handling quantity update:', { itemId, newQuantity });
    if (newQuantity < 1) return; // Prevent negative quantities
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      
      // Optimistically update the UI first
      setCart(prevCart => {
        const updatedItems = prevCart.items.map(item => 
          item._id === itemId 
            ? { ...item, quantity: newQuantity }
            : item
        );
        
        // Calculate new total
        const newTotal = updatedItems.reduce((sum, item) => 
          sum + (item.product.price * item.quantity), 0
        );
        
        return {
          ...prevCart,
          items: updatedItems,
          total: Number(newTotal.toFixed(2))
        };
      });

      const response = await fetch(`${apiUrl}/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId,
          quantity: newQuantity
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update quantity');
      }

      const responseData = await response.json();
      
      // Update cart with server response
      setCart(prevCart => ({
        ...prevCart,
        items: prevCart.items.map(item =>
          item._id === itemId
            ? { ...item, quantity: responseData.item.quantity }
            : item
        ),
        total: responseData.total
      }));
    } catch (error) {
      console.error('Error updating quantity:', error);
      // Refresh cart to revert changes if there was an error
      fetchCart();
    }
  }

  async function handleRemoveItem(itemId) {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      const response = await fetch(`${apiUrl}/api/cart/${itemId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to remove item');
      }
      
      await fetchCart();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading your cart...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-start justify-center bg-gradient-to-b from-blue-50 via-blue-100 to-white dark:from-slate-900 dark:via-indigo-900 dark:to-slate-950 transition-colors duration-500 py-10">
      <div className="relative z-10 w-full max-w-4xl bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl p-6 md:p-10">
        <h1 className="mb-6 text-2xl md:text-3xl font-bold text-primary">Your Cart</h1>

        {cart.items.length === 0 ? (
          <div className="text-center text-muted-foreground">Your cart is empty</div>
        ) : (
          <>
            <div className="space-y-4">
              {cart.items.map((item) => (
                <CartItem
                  key={item._id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>

            <div className="mt-6 flex flex-col md:flex-row items-center justify-between border-t pt-4">
              <div className="text-lg font-bold mb-4 md:mb-0">Total: ${cart.total.toFixed(2)}</div>
              <Button className="btn-primary" onClick={() => navigate('/checkout')}>
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}