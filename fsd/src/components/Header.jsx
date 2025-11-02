import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { ShoppingBag, User } from 'lucide-react'; // Using lucide-react for icons

// Simple NavLink component to avoid repetitive styling
const NavLink = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="text-gray-600 hover:text-blue-600 transition-colors"
  >
    {children}
  </button>
);

function Header() {
  const { user } = useAuth();
  const { cart } = useCart();

  // Calculate total items in the cart
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white shadow-md w-full">
      <nav className="container mx-auto p-4 flex justify-between items-center">
        {/* Logo/Brand */}
        <button
          onClick={() => setPage('home')}
          className="text-2xl font-bold text-blue-600"
        >
          ExamSite
        </button>

        {/* Navigation Links */}
        <div className="hidden md:flex gap-6 items-center">
          <NavLink onClick={() => setPage('home')}>Home</NavLink>
          <NavLink onClick={() => setPage('products')}>Products</NavLink>
          <NavLink onClick={() => setPage('hooks')}>Hooks Demo</NavLink>
        </div>

        {/* Auth & Cart Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setPage('products')}
            className="relative p-2 rounded-full hover:bg-gray-100"
            aria-label="Open cart"
          >
            <ShoppingBag className="w-6 h-6 text-gray-700" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                {totalItems}
              </span>
            )}
          </button>
          <button
            onClick={() => setPage('profile')}
            className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100"
            aria-label="Open profile"
          >
            <User className="w-6 h-6 text-gray-700" />
            <span className="hidden md:block text-sm font-medium text-gray-700">
              {user ? user.name : 'Login'}
            </span>
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Header;
