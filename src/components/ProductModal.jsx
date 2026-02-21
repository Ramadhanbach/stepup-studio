import { X, ShoppingCart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

const ProductModal = ({ product, isOpen, onClose }) => {
  if (!isOpen || !product) return null;

  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(null);

  const sizes = [39, 40, 41, 42, 43, 44];

  const handleAddToCart = () => {
    addToCart(product, selectedSize);
    if (selectedSize) onClose();
  };

  const handleViewDetails = () => {
    navigate(`/product/${product.id}#details`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-2 sm:px-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up flex flex-col md:flex-row max-h-[90vh] md:max-h-[600px]">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/70 rounded-full hover:bg-white transition-colors"
        >
          <X size={24} className="text-dark" />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-1/2 bg-gray-100 h-[50vh] md:h-auto">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details Section */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8 flex flex-col overflow-y-auto">
          <div className="mb-auto">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
              {product.category}
            </span>
            <h2 className="text-3xl font-bold text-dark mb-2">{product.name}</h2>
            <p className="text-2xl font-bold text-dark mb-4">
              Rp {product.price.toLocaleString()}
            </p>
            <p className="text-paragraph mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">Material</p>
                <p className="font-semibold text-dark">{product.specs.material}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">Weight</p>
                <p className="font-semibold text-dark">{product.specs.weight}</p>
              </div>
            </div>

            {/* Size Selector */}
            <div className="mb-6 sm:mb-8">
              <p className="text-sm font-semibold text-dark mb-3">Select Size</p>
              <div className="flex flex-wrap gap-2">
                {sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-10 h-10 sm:w-10 sm:h-10 rounded-lg border-2 flex items-center justify-center font-medium transition-all
                      ${selectedSize === size 
                        ? 'border-primary bg-primary text-dark' 
                        : 'border-gray-200 text-paragraph hover:border-primary'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4">
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-primary text-dark py-3 rounded-xl font-bold text-base sm:text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95"
            >
              <ShoppingCart size={20} /> Add to Cart
            </button>
            <button 
              onClick={handleViewDetails}
              className="px-6 py-3 border-2 border-dark text-dark rounded-xl font-bold text-base sm:text-lg hover:bg-dark hover:text-white transition-all"
            >
              Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
