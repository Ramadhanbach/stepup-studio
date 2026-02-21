import { Eye, ShoppingCart } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const ProductCard = ({ product, onOpenModal, index = 0 }) => {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="group relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:rotate-[0.25deg]"
      style={{
        animation: inView ? 'fade-in-up 600ms both' : 'none',
        animationDelay: `${Math.min(index, 10) * 80}ms`,
      }}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <picture>
          <source type="image/webp" srcSet={product.image.replace(/\.jpg$/i, '.webp').replace(/\.jpeg$/i, '.webp').replace(/\.png$/i, '.webp')} />
          <img 
            src={product.image} 
            alt={product.name} 
            loading="lazy"
            decoding="async"
            fetchpriority="low"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </picture>
        
        
        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          <button 
            onClick={() => onOpenModal(product)}
            className="p-3 bg-white text-dark rounded-full hover:bg-primary hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300"
            title="Quick View"
          >
            <Eye size={20} />
          </button>
          <button 
            onClick={() => onOpenModal(product)}
            className="p-3 bg-white text-dark rounded-full hover:bg-primary hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75 active:scale-95"
            title="Add to Cart"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-sm text-primary font-semibold mb-1">{product.category}</p>
        <h3 className="text-lg font-bold text-dark mb-2 truncate">{product.name}</h3>
        <p className="text-paragraph text-sm mb-3 line-clamp-1">{product.description}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-dark">
            Rp {product.price.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
