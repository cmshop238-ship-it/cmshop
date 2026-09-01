import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, ShoppingBag, Heart, ArrowRight, Check } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatVND, calculateDiscountPercent } from '../utils/format';

interface QuickViewModalProps {
  onNavigate: (path: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ onNavigate }) => {
  const { quickViewProduct, isQuickViewOpen, closeQuickView } = useShop();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (quickViewProduct) {
      setActiveImageIndex(0);
      setSelectedColor(quickViewProduct.colors?.[0]?.name || '');
      setSelectedSize(quickViewProduct.sizes?.[0] || '');
      setQuantity(1);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const discount = calculateDiscountPercent(quickViewProduct.originalPrice, quickViewProduct.price);
  const isFavorite = isInWishlist(quickViewProduct.id);
  const isOutOfStock = quickViewProduct.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(quickViewProduct, quantity, undefined, selectedColor, selectedSize, true);
    closeQuickView();
  };

  const handleGoToDetail = () => {
    closeQuickView();
    onNavigate(`/products/${quickViewProduct.slug}`);
  };

  return (
    <AnimatePresence>
      {isQuickViewOpen && (
        <div id="quickview-modal-container" className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeQuickView}
            className="fixed inset-0 bg-black/75 backdrop-blur-xs"
          />

          {/* Modal Content */}
          <div className="min-h-screen px-4 py-8 sm:py-12 flex items-center justify-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-4xl bg-[#FAFAFA] text-[#111111] shadow-2xl z-10 text-left border border-neutral-200 overflow-hidden relative"
            >
              {/* Close Button */}
              <button
                onClick={closeQuickView}
                className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-black hover:text-white rounded-full transition-colors z-20 cursor-pointer"
                aria-label="Đóng xem nhanh"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Left: Product Images */}
                <div className="p-6 bg-white border-b md:border-b-0 md:border-r border-neutral-200 flex flex-col">
                  <div className="relative aspect-[3/4] w-full bg-neutral-100 overflow-hidden border border-neutral-200 mb-3">
                    <img
                      src={quickViewProduct.images[activeImageIndex] || quickViewProduct.images[0]}
                      alt={quickViewProduct.name}
                      className="w-full h-full object-cover object-center"
                    />
                    {discount > 0 && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest bg-[#111111] text-white">
                        -{discount}%
                      </span>
                    )}
                  </div>

                  {/* Thumbnail Row */}
                  {quickViewProduct.images.length > 1 && (
                    <div className="flex gap-2">
                      {quickViewProduct.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImageIndex(idx)}
                          className={`w-16 h-18 bg-neutral-100 border transition-all overflow-hidden cursor-pointer ${
                            activeImageIndex === idx ? 'border-black ring-1 ring-black' : 'border-neutral-200 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: Product Info & Actions */}
                <div className="p-6 sm:p-8 flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Category & Rating */}
                    <div className="flex items-center justify-between text-xs text-neutral-500 uppercase tracking-widest">
                      <span>{quickViewProduct.category}</span>
                      <div className="flex items-center gap-1 text-neutral-800">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-semibold">{quickViewProduct.rating}</span>
                        <span className="text-neutral-400">({quickViewProduct.reviewCount} đánh giá)</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="font-serif-luxury text-2xl sm:text-3xl font-medium text-neutral-900 leading-tight">
                      {quickViewProduct.name}
                    </h2>

                    {/* Price */}
                    <div className="flex items-baseline gap-3">
                      <span className="text-xl sm:text-2xl font-bold font-sans-clean text-[#111111]">
                        {formatVND(quickViewProduct.price)}
                      </span>
                      {quickViewProduct.originalPrice && quickViewProduct.originalPrice > quickViewProduct.price && (
                        <span className="text-sm text-neutral-400 line-through">
                          {formatVND(quickViewProduct.originalPrice)}
                        </span>
                      )}
                    </div>

                    {/* Short Description */}
                    <p className="text-xs text-neutral-600 font-sans-clean leading-relaxed">
                      {quickViewProduct.shortDescription}
                    </p>

                    {/* Color Picker */}
                    {quickViewProduct.colors && quickViewProduct.colors.length > 0 && (
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-800 block mb-2">
                          Màu sắc: <span className="font-normal text-neutral-600">{selectedColor}</span>
                        </span>
                        <div className="flex gap-2">
                          {quickViewProduct.colors.map((color) => (
                            <button
                              key={color.name}
                              onClick={() => setSelectedColor(color.name)}
                              className={`w-7 h-7 rounded-full border-2 transition-all relative flex items-center justify-center cursor-pointer ${
                                selectedColor === color.name
                                  ? 'border-black scale-110'
                                  : 'border-neutral-300 hover:border-neutral-400'
                              }`}
                              style={{ backgroundColor: color.hex }}
                              title={color.name}
                            >
                              {selectedColor === color.name && (
                                <Check
                                  className={`w-3.5 h-3.5 ${
                                    color.hex.toLowerCase() === '#ffffff' || color.hex.toLowerCase() === '#f5f5f0'
                                      ? 'text-black'
                                      : 'text-white'
                                  }`}
                                />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Size Picker */}
                    {quickViewProduct.sizes && quickViewProduct.sizes.length > 0 && (
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-800 block mb-2">
                          Kích thước: <span className="font-normal text-neutral-600">{selectedSize}</span>
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {quickViewProduct.sizes.map((size) => (
                            <button
                              key={size}
                              onClick={() => setSelectedSize(size)}
                              className={`px-3 py-1.5 text-xs font-medium border transition-colors cursor-pointer ${
                                selectedSize === size
                                  ? 'bg-[#111111] text-white border-black'
                                  : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-500'
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Stock Status */}
                    <div className="text-xs text-neutral-600 flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          quickViewProduct.stock > 5
                            ? 'bg-emerald-500'
                            : quickViewProduct.stock > 0
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                      />
                      <span>
                        {quickViewProduct.stock > 5
                          ? `Còn hàng (${quickViewProduct.stock} sản phẩm)`
                          : quickViewProduct.stock > 0
                          ? `Chỉ còn ${quickViewProduct.stock} sản phẩm`
                          : 'Tạm hết hàng'}
                      </span>
                    </div>
                  </div>

                  {/* Bottom CTAs */}
                  <div className="pt-6 border-t border-neutral-200 space-y-3 mt-4">
                    <div className="flex gap-2">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-neutral-300 bg-white">
                        <button
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          className="px-2.5 py-2 text-xs hover:bg-neutral-100 transition-colors"
                        >
                          -
                        </button>
                        <span className="px-3 text-xs font-semibold">{quantity}</span>
                        <button
                          onClick={() => setQuantity((q) => Math.min(quickViewProduct.stock, q + 1))}
                          className="px-2.5 py-2 text-xs hover:bg-neutral-100 transition-colors"
                        >
                          +
                        </button>
                      </div>

                      {/* Add to Cart */}
                      <button
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                        className="flex-1 py-3 bg-[#111111] disabled:bg-neutral-300 text-white hover:bg-black text-xs font-semibold tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed shadow-sm"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>{isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ hàng'}</span>
                      </button>

                      {/* Wishlist */}
                      <button
                        onClick={() => toggleWishlist(quickViewProduct)}
                        className={`p-3 border transition-colors cursor-pointer ${
                          isFavorite
                            ? 'bg-[#111111] text-white border-black'
                            : 'bg-white text-neutral-700 border-neutral-300 hover:border-black'
                        }`}
                        aria-label="Yêu thích"
                      >
                        <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    <button
                      onClick={handleGoToDetail}
                      className="w-full text-center text-xs font-medium text-neutral-600 hover:text-black tracking-wider uppercase transition-colors flex items-center justify-center gap-1 py-1 cursor-pointer"
                    >
                      <span>Xem trang chi tiết đầy đủ</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
