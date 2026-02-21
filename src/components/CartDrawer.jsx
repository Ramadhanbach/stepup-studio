import { X, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CartDrawer = () => {
  const { cart, removeFromCart, updateQuantity, isCartOpen, setIsCartOpen, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty!", {
        position: 'top-center',
        duration: 3500,
        className: 'toast-error',
        style: { '--progress-duration': '3500ms' }
      });
      return;
    }
    
    // Dummy checkout
    toast.success("Checkout successful! Thank you for your purchase.", {
      position: 'top-center',
      duration: 3500,
      className: 'toast-success',
      style: { '--progress-duration': '3500ms' }
    });
    clearCart();
    setIsCartOpen(false);
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-dark">Your Cart</h2>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full text-dark transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-gray-500">
                <p>Your cart is empty.</p>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="text-primary hover:underline font-medium"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4 p-3 bg-gray-50 rounded-xl">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-dark line-clamp-1">{item.name}</h3>
                      <p className="text-sm text-gray-500">Size: {item.size}</p>
                      <p className="text-sm font-medium text-primary">Rp {item.price.toLocaleString()}</p>
                    </div>
                    
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm">
                        <button 
                          onClick={() => updateQuantity(item.id, item.size, -1)}
                          className="p-1 hover:bg-gray-100 rounded text-dark"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-medium w-4 text-center text-dark">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.size, 1)}
                          className="p-1 hover:bg-gray-100 rounded text-dark"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="text-red-500 hover:text-red-600 p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-gray-100 bg-white">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-500">Total</span>
                <span className="text-xl font-bold text-dark">Rp {cartTotal.toLocaleString()}</span>
              </div>
              <button 
                onClick={handleCheckout}
                className="w-full bg-primary hover:bg-red-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-primary/30"
              >
                Checkout Now <ArrowRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
