import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatVND } from '../utils/format';

interface CartDrawerProps {
  onNavigate: (path: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigate }) => {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    subtotal,
    shippingFee,
    discountAmount,
    totalAmount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    couponCodeInput,
    setCouponCodeInput,
    couponError,
  } = useCart();

  const [inputCode, setInputCode] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const success = applyCoupon(inputCode);
    if (success) {
      setInputCode('');
    }
  };

  const handleCheckoutClick = () => {
    closeCart();
    onNavigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="cart-drawer-container" className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Drawer Body */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="w-screen max-w-md bg-[#FAFAFA] text-[#111111] shadow-2xl flex flex-col h-full border-l border-neutral-200"
            >
              {/* Header */}
              <div className="p-5 sm:p-6 border-b border-neutral-200 flex items-center justify-between bg-white">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-5 h-5 text-[#111111]" />
                  <h2 className="font-serif-luxury text-xl font-medium tracking-wide">
                    Giỏ hàng của bạn
                  </h2>
                  <span className="text-xs text-neutral-500 font-sans-clean">
                    ({items.reduce((s, i) => s + i.quantity, 0)})
                  </span>
                </div>
                <button
                  onClick={closeCart}
                  className="p-1.5 text-neutral-500 hover:text-black transition-colors cursor-pointer"
                  aria-label="Đóng giỏ hàng"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 divide-y divide-neutral-200/80">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
                    <div className="w-16 h-16 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center mb-4 text-neutral-400">
                      <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                    </div>
                    <p className="font-serif-luxury text-lg font-medium text-neutral-800 mb-1">
                      Giỏ hàng của bạn đang trống
                    </p>
                    <p className="text-xs text-neutral-500 font-sans-clean max-w-xs mb-6">
                      Khám phá những thiết kế tối giản và sản phẩm tuyển chọn cao cấp tại CM.
                    </p>
                    <button
                      onClick={() => {
                        closeCart();
                        onNavigate('/products');
                      }}
                      className="px-6 py-2.5 bg-[#111111] text-white text-xs font-semibold tracking-widest uppercase hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      Khám phá sản phẩm
                    </button>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="pt-4 first:pt-0 flex gap-4">
                      {/* Product Thumbnail */}
                      <div className="w-20 h-24 sm:w-24 sm:h-28 shrink-0 bg-neutral-100 border border-neutral-200 overflow-hidden">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover object-center"
                        />
                      </div>

                      {/* Details & Controls */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-xs sm:text-sm font-sans-clean font-medium text-neutral-900 line-clamp-1">
                              {item.product.name}
                            </h3>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-neutral-600 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                              title="Xóa khỏi giỏ"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Selected Variant / Color / Size */}
                          <div className="text-[11px] text-neutral-500 space-x-2 mt-0.5">
                            {item.selectedColor && <span>Màu: {item.selectedColor}</span>}
                            {item.selectedSize && <span>• Size: {item.selectedSize}</span>}
                          </div>

                          <p className="text-xs font-sans-clean font-semibold text-[#111111] mt-1">
                            {formatVND(item.unitPrice)}
                          </p>
                        </div>

                        {/* Stepper + Subtotal */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center border border-neutral-300 bg-white">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1.5 hover:bg-neutral-100 text-neutral-600 hover:text-black transition-colors cursor-pointer"
                              aria-label="Giảm số lượng"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-semibold text-neutral-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1.5 hover:bg-neutral-100 text-neutral-600 hover:text-black transition-colors cursor-pointer"
                              aria-label="Tăng số lượng"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="text-xs font-semibold text-neutral-900">
                            {formatVND(item.unitPrice * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Summary & Checkout Footer */}
              {items.length > 0 && (
                <div className="p-5 sm:p-6 bg-white border-t border-neutral-200 space-y-4">
                  {/* Coupon Code Input */}
                  <div>
                    {!appliedCoupon ? (
                      <form onSubmit={handleApplyCoupon} className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={inputCode}
                            onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                            placeholder="Nhập mã ưu đãi (ví dụ: CM10)..."
                            className="w-full bg-neutral-50 border border-neutral-300 pl-8 pr-3 py-2 text-xs uppercase tracking-wider focus:outline-none focus:border-black transition-colors"
                          />
                        </div>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-neutral-900 text-white text-xs font-semibold tracking-wider uppercase hover:bg-black transition-colors cursor-pointer shrink-0"
                        >
                          Áp dụng
                        </button>
                      </form>
                    ) : (
                      <div className="flex items-center justify-between p-2.5 bg-neutral-50 border border-neutral-200 text-xs">
                        <div className="flex items-center gap-2">
                          <Tag className="w-3.5 h-3.5 text-emerald-600" />
                          <div>
                            <span className="font-semibold text-neutral-900">{appliedCoupon.code}</span>
                            <span className="text-neutral-500 text-[11px] ml-1.5">
                              (-{formatVND(discountAmount)})
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={removeCoupon}
                          className="text-neutral-400 hover:text-rose-600 text-xs transition-colors cursor-pointer"
                        >
                          Hủy
                        </button>
                      </div>
                    )}
                    {couponError && (
                      <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>
                    )}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-2 text-xs text-neutral-600 font-sans-clean">
                    <div className="flex justify-between">
                      <span>Tạm tính</span>
                      <span className="font-medium text-neutral-900">{formatVND(subtotal)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Phí vận chuyển</span>
                      <span>
                        {shippingFee === 0 ? (
                          <strong className="text-emerald-600 uppercase text-[11px]">Miễn phí</strong>
                        ) : (
                          formatVND(shippingFee)
                        )}
                      </span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-700">
                        <span>Giảm giá</span>
                        <span className="font-semibold">-{formatVND(discountAmount)}</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-neutral-200 flex justify-between items-baseline">
                      <span className="text-sm font-semibold text-neutral-900">Tổng cộng</span>
                      <span className="text-base sm:text-lg font-bold text-[#111111]">
                        {formatVND(totalAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Checkout CTA */}
                  <button
                    onClick={handleCheckoutClick}
                    className="w-full py-3.5 bg-[#111111] text-white hover:bg-black text-xs font-semibold tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.99]"
                  >
                    <span>Tiến hành thanh toán</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-600 uppercase tracking-widest pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-neutral-600" />
                    <span>Thanh toán bảo mật chuẩn SSL 256-bit</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
