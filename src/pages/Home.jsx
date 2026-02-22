import { useState, useMemo, useEffect, useRef } from 'react';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';

import { Search, Filter, ArrowDown } from 'lucide-react';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalProduct, setModalProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scrollerRef = useRef(null);
  const [scrollIndicator, setScrollIndicator] = useState({ width: 0, left: 0 });
  

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const openModal = (product) => {
    setModalProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalProduct(null);
  };

  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const wasDragging = useRef(false);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    wasDragging.current = false;
    startX.current = e.pageX - scrollerRef.current.offsetLeft;
    scrollLeft.current = scrollerRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    // Delay resetting wasDragging slightly to allow click handler to check it
    setTimeout(() => {
      wasDragging.current = false;
    }, 50);
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - scrollerRef.current.offsetLeft;
    const walk = (x - startX.current) * 2;
    if (Math.abs(walk) > 5) {
      wasDragging.current = true;
    }
    scrollerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleCaptureClick = (e) => {
    if (wasDragging.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // Custom Scrollbar Drag Logic
  const isScrollbarDragging = useRef(false);
  const scrollbarStartX = useRef(0);
  const scrollbarStartLeft = useRef(0);

  const handleScrollbarMouseDown = (e) => {
    e.stopPropagation();
    isScrollbarDragging.current = true;
    scrollbarStartX.current = e.pageX;
    scrollbarStartLeft.current = scrollerRef.current.scrollLeft;
    document.body.style.userSelect = 'none';
  };

  const handleScrollbarMouseMove = (e) => {
    if (!isScrollbarDragging.current || !scrollerRef.current) return;
    e.preventDefault();
    
    const trackWidth = scrollerRef.current.clientWidth;
    const scrollWidth = scrollerRef.current.scrollWidth;
    const maxScroll = scrollWidth - trackWidth;
    
    // Calculate movement ratio
    // The thumb moves a percentage of the track width
    // We need to convert pixel movement of mouse to scroll position
    // Movement ratio = maxScroll / trackWidth (roughly)
    // Actually, it's easier to use the percentage logic from the indicator
    
    const deltaX = e.pageX - scrollbarStartX.current;
    const percentageMove = (deltaX / trackWidth) * 100;
    
    // Convert percentage to scroll pixels
    // If thumb moves 10%, scroll moves 10% of maxScroll?
    // Indicator width is (clientWidth / scrollWidth) * 100
    // Indicator left is (scrollLeft / maxScroll) * (100 - width)
    
    const indicatorWidthPct = (trackWidth / scrollWidth) * 100;
    const availableTrackPct = 100 - indicatorWidthPct;
    
    if (availableTrackPct <= 0) return;

    const scrollDelta = (deltaX / trackWidth) * maxScroll * (100 / availableTrackPct);
    
    // Simplified: deltaX pixels on track corresponds to scroll change
    // Let's use a simpler approximation:
    // deltaX / trackWidth = deltaScroll / scrollWidth (wrong)
    // The visual indicator moves `availableTrackWidth` pixels for `maxScroll` content
    // availableTrackWidth = trackWidth - thumbWidth
    // thumbWidth = trackWidth * (trackWidth / scrollWidth)
    
    const thumbWidth = trackWidth * (trackWidth / scrollWidth);
    const availableSpace = trackWidth - thumbWidth;
    
    if (availableSpace > 0) {
      const scrollRatio = maxScroll / availableSpace;
      scrollerRef.current.scrollLeft = scrollbarStartLeft.current + (deltaX * scrollRatio);
    }
  };

  const handleScrollbarMouseUp = () => {
    isScrollbarDragging.current = false;
    document.body.style.userSelect = '';
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleScrollbarMouseMove);
    document.addEventListener('mouseup', handleScrollbarMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleScrollbarMouseMove);
      document.removeEventListener('mouseup', handleScrollbarMouseUp);
    };
  }, []);

  const handleShopNowClick = (e) => {
    e.preventDefault();
    const el = document.getElementById('products');
    if (!el) return;
    const navbarOffset = 80;
    const top = el.getBoundingClientRect().top + window.scrollY - navbarOffset;
    window.scrollTo({ top, behavior: 'smooth' });
  };
  

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      const widthPct = el.scrollWidth > 0 ? (el.clientWidth / el.scrollWidth) * 100 : 0;
      const leftPct = max > 0 ? (el.scrollLeft / max) * (100 - widthPct) : 0;
      setScrollIndicator({ width: widthPct, left: leftPct });
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [filteredProducts.length]);

  const heroImgRef = useRef(null);
  const productsContainerRef = useRef(null);
  const [heroVisible, setHeroVisible] = useState(false);
  const [productsVisible, setProductsVisible] = useState(false);
  const benefitsRef = useRef(null);
  const [benefitsVisible, setBenefitsVisible] = useState(false);

  useEffect(() => {
    const heroObs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setHeroVisible(true);
    }, { threshold: 0.2 });
    const prodObs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setProductsVisible(true);
    }, { threshold: 0.15 });
    const benObs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setBenefitsVisible(true);
    }, { threshold: 0.15 });
    if (heroImgRef.current) heroObs.observe(heroImgRef.current);
    if (productsContainerRef.current) prodObs.observe(productsContainerRef.current);
    if (benefitsRef.current) benObs.observe(benefitsRef.current);
    return () => {
      heroObs.disconnect();
      prodObs.disconnect();
      benObs.disconnect();
    };
  }, []);

  

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative h-auto md:h-[calc(100vh-80px)] py-16 md:py-0 flex items-center bg-white overflow-hidden">

        <div className="container relative z-10 flex flex-col md:flex-row items-center">
          <div className="w-full md:w-3/5 text-center md:text-left mb-8 md:mb-0">
            <h2 className="word-animate text-primary font-bold text-lg sm:text-xl mb-3 tracking-wider uppercase" style={{'--delay':'50ms'}}>New Collection 2026</h2>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-dark mb-4 sm:mb-6 leading-tight">
              <span className="whitespace-nowrap">
                <span className="word-animate" style={{'--delay':'100ms'}}>Step</span>{' '}
                <span className="word-animate" style={{'--delay':'200ms'}}>Into</span>{' '}
                <span className="word-animate" style={{'--delay':'300ms'}}>Your</span>
              </span>
              <br />
              <span>
                {'Confidence'.split('').map((ch, i) => (
                  <span
                    key={i}
                    className="text-primary word-animate"
                    style={{'--delay':`${450 + i * 60}ms`}}
                  >
                    {ch}
                  </span>
                ))}
              </span>
            </h1>
            <p className="word-animate text-lg text-paragraph mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed" style={{'--delay':'650ms'}}>
              StepUp Studio is a modern shoe brand that combines comfort, style, and performance in every step. 
              We present the best collection for lifestyle, sport, and daily wear.
            </p>
            <div>
              <a 
                href="#products" 
                className="word-animate inline-flex items-center gap-2 leading-none bg-dark text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg hover:shadow-xl"
                style={{'--delay':'800ms'}}
                onClick={handleShopNowClick}
              >
                <span className="inline-flex items-center gap-2">
                  <span>Shop Now</span>
                  <ArrowDown className="w-5 h-5 shrink-0" />
                </span>
              </a>
            </div>
          </div>
          
           <div className="w-full md:w-2/5 relative flex justify-center">
             <picture>
               <source type="image/webp" srcSet="/images/hero-shoe.webp" />
               <img 
                 src="/images/hero-shoe.jpg" 
                 alt="Hero Shoe" 
                 loading="eager"
                 decoding="async"
                 fetchpriority="high"
                 className="w-[80%] sm:w-full max-w-md sm:max-w-lg drop-shadow-2xl rotate-[-8deg] hover:rotate-0 transition-transform duration-700"
                 ref={heroImgRef}
                 style={{ animation: heroVisible ? 'fade-in-right 800ms both' : 'none' }}
               />
             </picture>
          </div>
        </div>
      </section>

      

      {/* Product Section */}
      <section id="products" className="py-20 bg-white scroll-mt-24">
        <div className="container" ref={productsContainerRef}>
          
          <div className="mb-8 md:mb-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
              <div 
                className="text-center md:text-left w-full md:w-auto"
                style={{ animation: productsVisible ? 'fade-in-right 800ms both' : 'none' }}
              >
                <h2 className="text-3xl sm:text-4xl font-bold text-dark">Our Collection</h2>
                <div className="h-1 w-20 bg-primary rounded-full mt-1 mx-auto md:mx-0" />
              </div>

              <div 
                className="flex flex-col sm:flex-row gap-3 w-full md:w-auto"
                style={{ animation: productsVisible ? 'fade-in-right 800ms both' : 'none', animationDelay: '200ms' }}
              >
                <div className="relative group w-full sm:w-auto">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                  <input 
                    type="text" 
                    placeholder="Search products..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-gray-50 text-dark focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
 
                <div className="flex overflow-x-auto pb-2 sm:pb-0 gap-2 no-scrollbar">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                        ${selectedCategory === category 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <>
              <div 
                ref={scrollerRef} 
                className="overflow-x-auto no-scrollbar -mx-4 px-4 cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onClickCapture={handleCaptureClick}
                style={{ animation: productsVisible ? 'fade-in-up 800ms both' : 'none', animationDelay: '400ms' }}
              >
                <div className="flex gap-6 snap-x snap-mandatory">
                  {filteredProducts.map((product, idx) => (
                    <div key={product.id} className="snap-start flex-shrink-0 w-64 sm:w-72 lg:w-80">
                      <ProductCard 
                        product={product} 
                        onOpenModal={openModal} 
                        index={idx}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 -mx-4 px-4">
                <div 
                  className="relative h-[8px] bg-gray-100 rounded-full cursor-pointer hover:h-[10px] transition-all duration-300"
                  onClick={(e) => {
                    if (isScrollbarDragging.current) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const trackWidth = rect.width;
                    const clickRatio = x / trackWidth;
                    const maxScroll = scrollerRef.current.scrollWidth - scrollerRef.current.clientWidth;
                    scrollerRef.current.scrollTo({ left: maxScroll * clickRatio, behavior: 'smooth' });
                  }}
                >
                  <div className="absolute inset-0 bg-dark/10 rounded-full" />
                  <div
                    className="absolute top-0 h-full bg-dark rounded-full cursor-grab active:cursor-grabbing hover:bg-black transition-colors"
                    style={{ width: `${scrollIndicator.width}%`, left: `${scrollIndicator.left}%` }}
                    onMouseDown={handleScrollbarMouseDown}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-paragraph text-xl">No products found matching your criteria.</p>
              <button 
                onClick={() => {setSearchTerm(''); setSelectedCategory('All');}}
                className="mt-4 text-primary font-bold hover:underline"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Benefits Section */}
          <div className="mt-16">
            <div className="mb-6">
              <h3 className="text-3xl sm:text-4xl font-bold text-dark">Our Priority</h3>
              <div className="h-1 w-20 bg-primary rounded-full mt-1" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" ref={benefitsRef}>
              {/* Card 1: Comfort */}
              <div className="group relative rounded-2xl shadow-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl perspective-1000" style={{ animation: benefitsVisible ? 'fade-in-left 700ms both' : 'none', animationDelay: '0ms' }}>
                <div className="relative w-full h-56 sm:h-64 transition-transform duration-500 preserve-3d group-hover:rotate-y-180 will-change-transform">
                  <div className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden bg-gray-200">
                    <picture className="contents">
                      <source type="image/webp" srcSet="/images/priority-comfort.webp" />
                      <img
                        src="/images/priority-comfort.jpg"
                        alt="Comfort Shoes"
                        loading="lazy"
                        decoding="async"
                        fetchpriority="low"
                        className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-125 backface-hidden"
                      />
                    </picture>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent group-hover:from-black/10 pointer-events-none" />
                    <div className="absolute left-4 bottom-4 pointer-events-none">
                      <span className="text-white text-2xl font-extrabold drop-shadow-md">Comfort</span>
                    </div>
                  </div>
                  <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl overflow-hidden bg-gray-800">
                    <picture className="contents">
                      <source type="image/webp" srcSet="/images/priority-comfort.webp" />
                      <img
                        src="/images/priority-comfort.jpg"
                        alt="Comfort Shoes Back"
                        loading="lazy"
                        decoding="async"
                        fetchpriority="low"
                        className="w-full h-full object-cover transform -scale-x-100 group-hover:brightness-125 backface-hidden"
                      />
                    </picture>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                    <div className="absolute left-4 bottom-4 right-4 pointer-events-none">
                      <p className="text-white text-sm opacity-90">Nyaman dipakai seharian berkat bantalan empuk dan bahan breathable.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Style */}
              <div className="group relative rounded-2xl shadow-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl perspective-1000" style={{ animation: benefitsVisible ? 'fade-in-left 700ms both' : 'none', animationDelay: '120ms' }}>
                <div className="relative w-full h-56 sm:h-64 transition-transform duration-500 preserve-3d group-hover:rotate-y-180 will-change-transform">
                  <div className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden bg-gray-200">
                    <picture className="contents">
                      <source type="image/webp" srcSet="/images/priority-stylish.webp" />
                      <img
                        src="/images/priority-stylish.jpg"
                        alt="Style Shoes"
                        loading="lazy"
                        decoding="async"
                        fetchpriority="low"
                        className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-125 backface-hidden"
                      />
                    </picture>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent group-hover:from-black/10 pointer-events-none" />
                    <div className="absolute left-4 bottom-4 pointer-events-none">
                      <span className="text-white text-2xl font-extrabold drop-shadow-md">Style</span>
                    </div>
                  </div>
                  <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl overflow-hidden bg-gray-800">
                    <picture className="contents">
                      <source type="image/webp" srcSet="/images/priority-stylish.webp" />
                      <img
                        src="/images/priority-stylish.jpg"
                        alt="Style Shoes Back"
                        loading="lazy"
                        decoding="async"
                        fetchpriority="low"
                        className="w-full h-full object-cover transform -scale-x-100 group-hover:brightness-125 backface-hidden"
                      />
                    </picture>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                    <div className="absolute left-4 bottom-4 right-4 pointer-events-none">
                      <p className="text-white text-sm opacity-90">Gaya modern yang meningkatkan kepercayaan diri dan mudah dipadu.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Performance */}
              <div className="group relative rounded-2xl shadow-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl perspective-1000" style={{ animation: benefitsVisible ? 'fade-in-left 700ms both' : 'none', animationDelay: '240ms' }}>
                <div className="relative w-full h-56 sm:h-64 transition-transform duration-500 preserve-3d group-hover:rotate-y-180 will-change-transform">
                  <div className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden bg-gray-200">
                    <picture className="contents">
                      <source type="image/webp" srcSet="/images/priority-affordable.webp" />
                      <img
                        src="/images/priority-affordable.jpg"
                        alt="Performance Shoes"
                        loading="lazy"
                        decoding="async"
                        fetchpriority="low"
                        className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-125 backface-hidden"
                      />
                    </picture>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent group-hover:from-black/10 pointer-events-none" />
                    <div className="absolute left-4 bottom-4 pointer-events-none">
                      <span className="text-white text-2xl font-extrabold drop-shadow-md">Performance</span>
                    </div>
                  </div>
                  <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl overflow-hidden bg-gray-800">
                    <picture className="contents">
                      <source type="image/webp" srcSet="/images/priority-affordable.webp" />
                      <img
                        src="/images/priority-affordable.jpg"
                        alt="Performance Shoes Back"
                        loading="lazy"
                        decoding="async"
                        fetchpriority="low"
                        className="w-full h-full object-cover transform -scale-x-100 group-hover:brightness-125 backface-hidden"
                      />
                    </picture>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                    <div className="absolute left-4 bottom-4 right-4 pointer-events-none">
                      <p className="text-white text-sm opacity-90">Performa tinggi dengan traksi mantap dan respons cepat saat bergerak.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Modal */}
      {isModalOpen && (
        <ProductModal 
          product={modalProduct} 
          isOpen={isModalOpen} 
          onClose={closeModal} 
        />
      )}
    </div>
  );
};

export default Home;
