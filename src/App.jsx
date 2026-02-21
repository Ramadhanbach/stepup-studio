import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';

function App() {
  return (
      <CartProvider>
        <FavoritesProvider>
          <Router>
          <div className="min-h-screen bg-white transition-colors duration-300">
            <Navbar />
            <CartDrawer />
            <Toaster
              position="top-center"
              toastOptions={{
                success: { duration: 3500 },
                error: { duration: 3500 },
              }}
            />
            
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetail />} />
            </Routes>
            <Footer />
          </div>
          </Router>
        </FavoritesProvider>
      </CartProvider>
  );
}

export default App;
