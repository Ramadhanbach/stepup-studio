import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id, name) => {
    setFavorites(prev => {
      const isFav = prev.includes(id);
      const next = isFav ? prev.filter(x => x !== id) : [...prev, id];
      toast[isFav ? 'error' : 'success'](
        isFav ? 'Removed from wishlist' : 'Added to wishlist',
        {
          id: `fav-${id}`,
          position: 'top-center',
          duration: 2500,
          className: isFav ? 'toast-error' : 'toast-success',
          style: { '--progress-duration': '2500ms' }
        }
      );
      return next;
    });
  };

  const value = useMemo(() => ({
    favorites,
    isFavorite: (id) => favorites.includes(id),
    toggleFavorite,
  }), [favorites]);

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
