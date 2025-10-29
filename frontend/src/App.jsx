import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { UserProvider, useUser } from './lib/userContext.jsx';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';

// A simple Cart Icon (replace with a component like Lucide's ShoppingCart)
const ShoppingCartIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 12.08a2 2 0 0 0 2 1.92h9.72a2 2 0 0 0 2-1.92L23 6H6" />
  </svg>
);

function App() {
  const location = useLocation();

  return (
    <UserProvider>
      <AppContent location={location} />
    </UserProvider>
  );
}

function ProtectedRoute({ children }) {
  const { user } = useUser();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
}

function AppContent({ location }) {
  const { user, logout } = useUser();
  
  // Helper function for active link styles
  const getNavLinkClasses = (path) => 
    `flex items-center text-sm font-semibold transition-all duration-300 px-3 py-2 rounded-lg 
    ${location.pathname === path 
      ? 'bg-primary text-primary-foreground shadow-md' // Active state: strong background and shadow
      : 'text-muted-foreground hover:bg-accent hover:text-foreground' // Inactive state: subtle hover
    }`;

  return (
    // Use transparent container so global background gradient is visible
    <div className="min-h-screen flex flex-col bg-transparent transition-colors duration-300">
      
      {/* 🌟 Header Section: Elevated Design */}
      <header className="sticky top-0 z-50 border-b bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm">
        <nav className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link to="/" className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-400 bg-clip-text text-transparent">
              Tech Trove
            </Link>
            
            {/* Navigation Links */}
            <div className="flex items-center gap-2 md:gap-4">
              <Link to="/" className={getNavLinkClasses('/')}>
                Home
              </Link>
              <Link to="/products" className={getNavLinkClasses('/products')}>
                Products
              </Link>
              <Link to="/cart" className={getNavLinkClasses('/cart')}>
                <ShoppingCartIcon className="mr-1 h-5 w-5" />
                Cart
              </Link>
              {user ? (
                <>
                  <button
                    onClick={logout}
                    className="flex items-center text-sm font-semibold text-red-500 hover:text-red-600 transition-colors px-3 py-2"
                  >
                    Logout
                  </button>
                  <span className="text-sm text-muted-foreground">
                    {user.email}
                  </span>
                </>
              ) : (
                <Link to="/login" className={getNavLinkClasses('/login')}>
                  Login
                </Link>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {/* 💡 Footer Section */}
      <footer className="border-t bg-gray-100 dark:bg-gray-900 mt-12">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Tech Trove. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
          </div>
        </div>
      </footer>

      <Toaster 
        position="top-right"
        expand={true}
        richColors
      />
    </div>
  );
}

export default App;