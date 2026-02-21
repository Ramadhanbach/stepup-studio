import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { cartCount, setIsCartOpen } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm transition-colors duration-300">
      <div className="container py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-primary tracking-tighter flex items-center gap-2">
          StepUp <span className="text-dark">Studio</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-dark hover:text-primary transition-colors font-medium">Home</Link>
          <a href="#products" className="text-dark hover:text-primary transition-colors font-medium">Collection</a>
          <a href="#" className="text-dark hover:text-primary transition-colors font-medium">About</a>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsCartOpen(true)} 
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors text-dark"
            aria-label="Open Cart"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-primary text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full cart-bounce">
                {cartCount}
              </span>
            )}
          </button>

          <button 
            className="md:hidden p-2 text-dark"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 absolute w-full shadow-xl rounded-b-2xl overflow-hidden transition-all animate-fade-in-down">
          <div className="flex flex-col p-6 gap-6">
            <Link 
              to="/" 
              className="text-dark hover:text-primary font-bold text-lg border-b border-gray-50 pb-2" 
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <a 
              href="#products" 
              className="text-dark hover:text-primary font-bold text-lg border-b border-gray-50 pb-2" 
              onClick={() => setIsMenuOpen(false)}
            >
              Collection
            </a>
            <a 
              href="#" 
              className="text-dark hover:text-primary font-bold text-lg pb-2" 
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
