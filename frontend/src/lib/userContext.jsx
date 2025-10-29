import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const UserContext = createContext();

// Hardcoded credentials
const VALID_CREDENTIALS = {
  email: 'user@example.com',
  password: 'password123'
};

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check for saved auth on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (email, password) => {
    if (email === VALID_CREDENTIALS.email && password === VALID_CREDENTIALS.password) {
      const userData = { email, userId: 'default-user' };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      navigate('/');
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}