import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product, Coupon, ProductReview } from '../types';
import { productService } from '../services/productService';
import { couponService } from '../services/couponService';
import { reviewService } from '../services/reviewService';
import { useToast } from './ToastContext';

interface ShopContextType {
  products: Product[];
  coupons: Coupon[];
  isLoading: boolean;
  quickViewProduct: Product | null;
  isQuickViewOpen: boolean;
  isSearchOpen: boolean;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  refreshCatalog: () => Promise<void>;
  getProductBySlug: (slug: string) => Product | undefined;
  getProductById: (id: string) => Product | undefined;
  addReview: (productId: string, review: { userName: string; rating: number; comment: string; userId?: string; userAvatar?: string }) => Promise<void>;
  // Admin actions
  addProduct: (productData: Partial<Product>) => Promise<Product | null>;
  updateProduct: (id: string, productData: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  updateStock: (id: string, newStock: number) => Promise<void>;
  addCoupon: (coupon: Partial<Coupon>) => Promise<boolean>;
  toggleCouponStatus: (code: string) => Promise<void>;
  deleteCoupon: (code: string) => Promise<void>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { success, error } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const refreshCatalog = useCallback(async () => {
    try {
      setIsLoading(true);
      const [prods, coupList] = await Promise.all([
        productService.getProducts(),
        couponService.getCoupons().catch(() => []),
      ]);
      setProducts(prods || []);
      setCoupons(coupList || []);
    } catch (err: any) {
      console.error('Lỗi nạp danh mục sản phẩm:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCatalog();
  }, [refreshCatalog]);

  const openQuickView = useCallback((product: Product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  }, []);

  const closeQuickView = useCallback(() => {
    setIsQuickViewOpen(false);
    setTimeout(() => setQuickViewProduct(null), 200);
  }, []);

  const openSearch = useCallback(() => setIsSearchOpen(true), []);
  const closeSearch = useCallback(() => setIsSearchOpen(false), []);

  const getProductBySlug = useCallback(
    (slug: string) => {
      return products.find((p) => p.slug === slug || p.id === slug);
    },
    [products]
  );

  const getProductById = useCallback(
    (id: string) => {
      return products.find((p) => p.id === id);
    },
    [products]
  );

  const addReview = useCallback(
    async (productId: string, reviewData: { userName: string; rating: number; comment: string; userId?: string; userAvatar?: string }) => {
      try {
        await reviewService.submitReview({
          productId,
          userName: reviewData.userName,
          rating: reviewData.rating,
          comment: reviewData.comment,
          userId: reviewData.userId,
          userAvatar: reviewData.userAvatar,
          verifiedPurchase: true,
        });
        success('Cảm ơn bạn! Đánh giá của bạn đã được ghi nhận vào hệ thống.');
        refreshCatalog();
      } catch (err: any) {
        error(err.message || 'Không thể gửi đánh giá.');
      }
    },
    [success, error, refreshCatalog]
  );

  // Admin Methods
  const addProduct = useCallback(
    async (productData: Partial<Product>): Promise<Product | null> => {
      try {
        const newProduct = await productService.createProduct(productData);
        setProducts((prev) => [newProduct, ...prev]);
        success(`Đã thêm sản phẩm "${newProduct.name}" vào hệ thống`);
        return newProduct;
      } catch (err: any) {
        error(err.message || 'Lỗi thêm sản phẩm.');
        return null;
      }
    },
    [success, error]
  );

  const updateProduct = useCallback(
    async (id: string, productData: Partial<Product>): Promise<boolean> => {
      try {
        const updated = await productService.updateProduct(id, productData);
        setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
        success('Đã cập nhật thông tin sản phẩm trên hệ thống.');
        return true;
      } catch (err: any) {
        error(err.message || 'Lỗi cập nhật sản phẩm.');
        return false;
      }
    },
    [success, error]
  );

  const deleteProduct = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        await productService.deleteProduct(id);
        setProducts((prev) => prev.filter((p) => p.id !== id));
        success('Đã xóa sản phẩm khỏi cơ sở dữ liệu');
        return true;
      } catch (err: any) {
        error(err.message || 'Lỗi xóa sản phẩm.');
        return false;
      }
    },
    [success, error]
  );

  const updateStock = useCallback(
    async (id: string, newStock: number) => {
      try {
        await productService.updateProduct(id, { stock: newStock });
        setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, stock: newStock } : p)));
        success('Đã cập nhật số lượng tồn kho.');
      } catch (err: any) {
        error(err.message || 'Không thể cập nhật tồn kho.');
      }
    },
    [success, error]
  );

  const addCoupon = useCallback(
    async (coupon: Partial<Coupon>): Promise<boolean> => {
      try {
        const newCoupon = await couponService.createCoupon(coupon);
        setCoupons((prev) => [newCoupon, ...prev]);
        success(`Đã phát hành mã ưu đãi "${newCoupon.code}"`);
        return true;
      } catch (err: any) {
        error(err.message || 'Lỗi tạo mã giảm giá.');
        return false;
      }
    },
    [success, error]
  );

  const toggleCouponStatus = useCallback(
    async (code: string) => {
      try {
        const existing = coupons.find((c) => c.code === code);
        if (!existing) return;
        const updated = await couponService.updateCoupon(code, { isActive: !existing.isActive });
        setCoupons((prev) => prev.map((c) => (c.code === code ? updated : c)));
        success(`Đã ${updated.isActive ? 'kích hoạt' : 'tạm dừng'} mã "${code}"`);
      } catch (err: any) {
        error(err.message || 'Không thể cập nhật trạng thái mã.');
      }
    },
    [coupons, success, error]
  );

  const deleteCoupon = useCallback(
    async (code: string) => {
      try {
        await couponService.deleteCoupon(code);
        setCoupons((prev) => prev.filter((c) => c.code !== code));
        success(`Đã xóa mã ưu đãi ${code}`);
      } catch (err: any) {
        error(err.message || 'Không thể xóa mã ưu đãi.');
      }
    },
    [success, error]
  );

  return (
    <ShopContext.Provider
      value={{
        products,
        coupons,
        isLoading,
        quickViewProduct,
        isQuickViewOpen,
        isSearchOpen,
        openQuickView,
        closeQuickView,
        openSearch,
        closeSearch,
        refreshCatalog,
        getProductBySlug,
        getProductById,
        addReview,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStock,
        addCoupon,
        toggleCouponStatus,
        deleteCoupon,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = (): ShopContextType => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
