import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { CartItem, Product, ProductVariant, Coupon } from '../types';
import { StorageService, STORAGE_KEYS } from '../services/storageService';
import { couponService } from '../services/couponService';
import { useToast } from './ToastContext';

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  totalQuantity: number;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  appliedCoupon: Coupon | null;
  couponCodeInput: string;
  couponError: string | null;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (
    product: Product,
    quantity?: number,
    selectedVariant?: ProductVariant,
    selectedColor?: string,
    selectedSize?: string,
    openDrawerAfterAdd?: boolean
  ) => boolean;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  setCouponCodeInput: (code: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { success, error, info } = useToast();

  const [items, setItems] = useState<CartItem[]>(() => {
    return StorageService.get<CartItem[]>(STORAGE_KEYS.CART, []);
  });

  const [isOpen, setIsOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  // Sync with localStorage
  useEffect(() => {
    StorageService.set(STORAGE_KEYS.CART, items);
  }, [items]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

  const addToCart = useCallback(
    (
      product: Product,
      quantity: number = 1,
      selectedVariant?: ProductVariant,
      selectedColor?: string,
      selectedSize?: string,
      openDrawerAfterAdd: boolean = true
    ): boolean => {
      if (product.stock <= 0) {
        error(`Sản phẩm "${product.name}" hiện đang tạm hết hàng.`);
        return false;
      }

      const variantKey = [
        selectedVariant?.id || '',
        selectedColor || '',
        selectedSize || '',
      ].filter(Boolean).join('-');
      const cartItemId = variantKey ? `${product.id}-${variantKey}` : product.id;

      setItems((prevItems) => {
        const existingIndex = prevItems.findIndex((item) => item.id === cartItemId);
        const currentQtyInCart = existingIndex > -1 ? prevItems[existingIndex].quantity : 0;
        const newTotalQty = currentQtyInCart + quantity;

        if (newTotalQty > product.stock) {
          error(`Số lượng (${newTotalQty}) vượt quá tồn kho khả dụng (${product.stock}).`);
          return prevItems;
        }

        const unitPrice = selectedVariant?.price || product.price;

        if (existingIndex > -1) {
          const updated = [...prevItems];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: newTotalQty,
            unitPrice,
          };
          return updated;
        } else {
          const newItem: CartItem = {
            id: cartItemId,
            productId: product.id,
            product,
            selectedVariant,
            selectedColor,
            selectedSize,
            quantity,
            unitPrice,
          };
          return [...prevItems, newItem];
        }
      });

      success(`Đã thêm "${product.name}" vào giỏ hàng.`);
      if (openDrawerAfterAdd) {
        setIsOpen(true);
      }
      return true;
    },
    [success, error]
  );

  const updateQuantity = useCallback(
    (cartItemId: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeFromCart(cartItemId);
        return;
      }

      setItems((prev) =>
        prev.map((item) => {
          if (item.id === cartItemId) {
            if (newQuantity > item.product.stock) {
              error(`Kho chỉ còn ${item.product.stock} sản phẩm.`);
              return item;
            }
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
      );
    },
    [error]
  );

  const removeFromCart = useCallback(
    (cartItemId: string) => {
      setItems((prev) => {
        const itemToRemove = prev.find((i) => i.id === cartItemId);
        if (itemToRemove) {
          info(`Đã xóa "${itemToRemove.product.name}" khỏi giỏ hàng.`);
        }
        return prev.filter((item) => item.id !== cartItemId);
      });
    },
    [info]
  );

  const clearCart = useCallback(() => {
    setItems([]);
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponCodeInput('');
  }, []);

  // Recalculate subtotal
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  // Standard shipping rule: Free for orders >= 2.000.000₫
  const shippingFee = items.length === 0 ? 0 : subtotal >= 2000000 ? 0 : 30000;

  // Auto re-validate coupon if subtotal changes
  useEffect(() => {
    if (appliedCoupon && subtotal > 0) {
      couponService
        .validateCoupon(appliedCoupon.code, subtotal)
        .then((res) => {
          setDiscountAmount(res.discountAmount);
          setCouponError(null);
        })
        .catch((err) => {
          setDiscountAmount(0);
          setAppliedCoupon(null);
          setCouponError(err.message || 'Mã giảm giá không còn khả dụng cho giá trị đơn hàng hiện tại.');
        });
    } else if (subtotal === 0) {
      setDiscountAmount(0);
    }
  }, [subtotal, appliedCoupon]);

  const totalAmount = Math.max(0, subtotal + shippingFee - discountAmount);

  const applyCoupon = useCallback(
    async (codeToApply: string): Promise<boolean> => {
      const cleanCode = codeToApply.trim().toUpperCase();
      if (!cleanCode) {
        setCouponError('Vui lòng nhập mã giảm giá');
        return false;
      }

      try {
        const result = await couponService.validateCoupon(cleanCode, subtotal);
        setAppliedCoupon({
          code: result.code,
          discountType: result.discountType,
          discountValue: result.discountValue,
          minimumOrder: 0,
          startDate: '',
          endDate: '',
          isActive: true,
          description: result.description,
        });
        setDiscountAmount(result.discountAmount);
        setCouponError(null);
        success(`Đã áp dụng mã "${result.code}": Giảm ${result.discountAmount.toLocaleString('vi-VN')}₫`);
        return true;
      } catch (err: any) {
        const msg = err.message || 'Mã giảm giá không hợp lệ hoặc đã hết hạn';
        setCouponError(msg);
        error(msg);
        return false;
      }
    },
    [subtotal, success, error]
  );

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponCodeInput('');
    setCouponError(null);
    info('Đã hủy áp dụng mã giảm giá.');
  }, [info]);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        totalQuantity,
        subtotal,
        shippingFee,
        discountAmount,
        totalAmount,
        appliedCoupon,
        couponCodeInput,
        couponError,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        setCouponCodeInput,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
