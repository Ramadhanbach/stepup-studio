import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, size) => {
    if (!size) {
      toast.error("Please select a size!", {
        position: 'top-center',
        duration: 3500,
        className: 'toast-error',
        style: { '--progress-duration': '3500ms' }
      });
      return;
    }

    const toastId = `cart-${product.id}-${size}`;

    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id && item.size === size);
      if (existingItem) {
        toast.success(`Increased quantity of ${product.name}`, {
          id: toastId,
          position: 'top-center',
          duration: 3500,
          className: 'toast-success',
          style: { '--progress-duration': '3500ms' }
        });
        return prev.map(item => 
          item.id === product.id && item.size === size 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      toast.success(`${product.name} added to cart!`, {
        id: toastId,
        position: 'top-center',
        duration: 3500,
        className: 'toast-success',
        style: { '--progress-duration': '3500ms' }
      });
      return [...prev, { ...product, size, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id, size) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.size === size)));
    toast.error("Item removed", {
      position: 'top-center',
      duration: 2500,
      className: 'toast-error',
      style: { '--progress-duration': '2500ms' }
    });
  };

  const updateQuantity = (id, size, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id && item.size === size) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      isCartOpen,
      setIsCartOpen,
      cartTotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
