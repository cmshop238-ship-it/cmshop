import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product } from '../types';
import { StorageService, STORAGE_KEYS } from '../services/storageService';
import { useToast } from './ToastContext';

interface WishlistContextType {
  wishlistIds: string[];
  wishlistProducts: Product[];
  isOpen: boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { success, info } = useToast();

  const [wishlistProducts, setWishlistProducts] = useState<Product[]>(() => {
    return StorageService.get<Product[]>(STORAGE_KEYS.WISHLIST, []);
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    StorageService.set(STORAGE_KEYS.WISHLIST, wishlistProducts);
  }, [wishlistProducts]);

  const openWishlist = useCallback(() => setIsOpen(true), []);
  const closeWishlist = useCallback(() => setIsOpen(false), []);

  const isInWishlist = useCallback(
    (productId: string) => {
      return wishlistProducts.some((p) => p.id === productId);
    },
    [wishlistProducts]
  );

  const toggleWishlist = useCallback(
    (product: Product) => {
      setWishlistProducts((prev) => {
        const exists = prev.some((p) => p.id === product.id);
        if (exists) {
          info(`Đã bỏ "${product.name}" khỏi danh sách yêu thích.`);
          return prev.filter((p) => p.id !== product.id);
        } else {
          success(`Đã thêm "${product.name}" vào danh sách yêu thích.`);
          return [...prev, product];
        }
      });
    },
    [success, info]
  );

  const removeFromWishlist = useCallback(
    (productId: string) => {
      setWishlistProducts((prev) => {
        const item = prev.find((p) => p.id === productId);
        if (item) {
          info(`Đã bỏ "${item.name}" khỏi danh sách yêu thích.`);
        }
        return prev.filter((p) => p.id !== productId);
      });
    },
    [info]
  );

  const wishlistIds = wishlistProducts.map((p) => p.id);

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistProducts,
        isOpen,
        openWishlist,
        closeWishlist,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
