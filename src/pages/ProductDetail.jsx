import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { useState, useEffect, useRef } from 'react';
import { Star, ArrowLeft, ShoppingCart, Share2, Heart } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const detailsRef = useRef(null);

  useEffect(() => {
    const foundProduct = products.find(p => p.id === parseInt(id));
    if (foundProduct) {
      setProduct(foundProduct);
      setActiveImage(foundProduct.image);
    }
  }, [id]);

  useEffect(() => {
    // Ensure page starts at top
    window.scrollTo({ top: 0, behavior: 'instant' });
    // If hash requests details, scroll to details card with navbar offset
    if (location.hash === '#details' && detailsRef.current) {
      const rect = detailsRef.current.getBoundingClientRect();
      const top = rect.top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, [location.hash, product]);
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-dark dark:text-white pt-20">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <button 
          onClick={() => navigate('/')}
          className="text-primary hover:underline flex items-center gap-2"
        >
          <ArrowLeft size={20} /> Back to Home
        </button>
      </div>
    );
  }

  const sizes = [39, 40, 41, 42, 43, 44];
  const gallery = [product.image, product.image, product.image]; // Dummy gallery

  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-12 bg-white transition-colors duration-300">
      <div className="container mx-auto px-4">
        
        {/* Breadcrumb / Back */}
        <button 
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-gray-500 hover:text-primary transition-colors"
        >
          <ArrowLeft size={20} /> Back
        </button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-4 sm:p-6 md:p-10 flex flex-col lg:flex-row gap-8 md:gap-12">
          
          {/* Gallery Section */}
          <div className="w-full lg:w-1/2 space-y-3 sm:space-y-4">
            <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden relative group">
              <picture>
                <source type="image/webp" srcSet={activeImage.replace(/\.jpg$/i, '.webp').replace(/\.jpeg$/i, '.webp').replace(/\.png$/i, '.webp')} />
                <img 
                  src={activeImage} 
                  alt={product.name} 
                  loading="lazy"
                  decoding="async"
                  fetchpriority="low"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </picture>
              <button
                onClick={() => toggleFavorite(product.id, product.name)}
                aria-label="Toggle Wishlist"
                className={`absolute top-4 right-4 p-3 bg-white/80 rounded-full transition-transform ${isFavorite(product.id) ? 'text-red-500 heart-pop' : 'text-gray-600 hover:scale-110'}`}
              >
                <Heart size={24} fill={isFavorite(product.id) ? 'currentColor' : 'none'} />
              </button>
            </div>
            
            <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 no-scrollbar">
              {gallery.map((img, index) => (
                <button 
                  key={index}
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0
                    ${activeImage === img ? 'border-primary' : 'border-transparent hover:border-gray-300'}`}
                >
                  <picture>
                    <source type="image/webp" srcSet={img.replace(/\.jpg$/i, '.webp').replace(/\.jpeg$/i, '.webp').replace(/\.png$/i, '.webp')} />
                    <img src={img} alt={`Thumbnail ${index}`} loading="lazy" decoding="async" fetchpriority="low" className="w-full h-full object-cover" />
                  </picture>
                </button>
              ))}
            </div>
          </div>

          {/* Details Section */}
          <div id="details" ref={detailsRef} className="w-full lg:w-1/2 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-yellow-400">
                <Star size={20} fill="currentColor" />
                <span className="font-bold text-dark ml-1">{product.rating}</span>
                <span className="text-gray-400 text-sm">(120 Reviews)</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-dark mb-4 leading-tight">
              {product.name}
            </h1>

            <p className="text-2xl sm:text-3xl font-bold text-primary mb-6 sm:mb-8">
              Rp {product.price.toLocaleString()}
            </p>

            <div className="prose mb-8 text-paragraph">
              <p>{product.details}</p>
            </div>

            {/* Specifications */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="flex flex-col p-4 bg-gray-50 rounded-2xl">
                  <span className="text-xs text-gray-500 uppercase font-bold mb-1">{key}</span>
                  <span className="font-semibold text-dark capitalize">{value}</span>
                </div>
              ))}
            </div>

            {/* Size Selector */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-dark">Select Size (EU)</span>
                <button className="text-primary text-sm hover:underline">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl border-2 flex items-center justify-center font-bold text-base sm:text-lg transition-all
                      ${selectedSize === size 
                        ? 'border-primary bg-primary text-white shadow-lg shadow-primary/30 scale-110' 
                        : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-auto">
              <button 
                onClick={() => addToCart(product, selectedSize)}
                className="flex-[2] bg-dark text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg flex items-center justify-center gap-3 hover:bg-opacity-90 transition-all active:scale-95 shadow-xl"
              >
                <ShoppingCart size={24} /> Add to Cart
              </button>
              <button className="flex-1 border-2 border-gray-200 text-dark py-3 sm:py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
                <Share2 size={24} /> Share
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
