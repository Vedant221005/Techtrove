import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Receipt } from '../components/Receipt';
import { useUser } from '../lib/userContext.jsx';
import { API_URL } from '../lib/config.js';

export default function Checkout() {
  const navigate = useNavigate();
  const { userId } = useUser();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/cart/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, userId }),
      });

      const data = await response.json();
      // Show the receipt
      setReceiptData(data);
    } catch (error) {
      console.error('Error during checkout:', error);
      // Show error toast
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <div className="min-h-screen flex items-start justify-center bg-gradient-to-b from-blue-50 via-blue-100 to-white dark:from-slate-900 dark:via-indigo-900 dark:to-slate-950 transition-colors duration-500 py-10">
      <div className="relative z-10 w-full max-w-md bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl p-6 md:p-10">
        <h1 className="mb-6 text-3xl font-bold text-primary">Checkout</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full rounded-md border border-input bg-transparent px-3 py-2"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-md border border-input bg-transparent px-3 py-2"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <Button type="submit" className="w-full btn-primary" disabled={loading}>
            {loading ? 'Processing...' : 'Complete Order'}
          </Button>
        </form>
      </div>
      
      {/* Receipt Modal */}
      {receiptData && (
        <Receipt
          receipt={receiptData}
          onClose={() => {
            setReceiptData(null);
            navigate('/');
          }}
        />
      )}
    </div>
  );
}