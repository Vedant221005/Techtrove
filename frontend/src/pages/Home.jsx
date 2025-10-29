import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-12 text-center bg-gradient-to-b from-blue-50 via-blue-100 to-white dark:from-slate-900 dark:via-indigo-900 dark:to-slate-950 transition-colors duration-500">
      
      {/* Hero Section */}
      <div className="space-y-6 md:space-y-8 animate-in fade-in-up duration-1000">
        {/* Title with Gradient and Subtle Shadow */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight drop-shadow-lg">
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-400 bg-clip-text text-transparent">
            Tech Trove
          </span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl leading-relaxed">
          Discover our curated collection of <strong>premium products</strong>. From cutting-edge tech gadgets to everyday essentials,
          <span className="font-medium text-blue-700 dark:text-blue-300 ml-1">we've got everything you need to upgrade your life.</span>
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Button asChild size="lg" className="text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.03] btn-primary">
          <Link to="/Techtrove/products">🛍️ Browse Products</Link>
        </Button>
      </div>

      <hr className="w-1/3 border-t border-gray-200 dark:border-gray-700 my-8" />
      
      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4 max-w-5xl w-full">
        
        {/* Feature Card 1: Fast Shipping */}
  <div className="p-8 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-850 shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 hover:border-blue-500">
          <div className="text-4xl mb-3">🚀</div>
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Fast Shipping</h3>
          <p className="text-gray-500 dark:text-gray-400">Quick delivery right to your doorstep, typically within 1-3 business days.</p>
        </div>

        {/* Feature Card 2: Secure Payments */}
  <div className="p-8 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-850 shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 hover:border-blue-500">
          <div className="text-4xl mb-3">🔒</div>
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Secure Payments</h3>
          <p className="text-gray-500 dark:text-gray-400">Industry-leading encryption ensures safe and protected transaction processing.</p>
        </div>

        {/* Feature Card 3: 24/7 Support */}
  <div className="p-8 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-850 shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 hover:border-blue-500">
          <div className="text-4xl mb-3">💬</div>
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">24/7 Support</h3>
          <p className="text-gray-500 dark:text-gray-400">Our dedicated team is always here to help you, any time of day or night.</p>
        </div>
      </div>
    </div>
  );
}