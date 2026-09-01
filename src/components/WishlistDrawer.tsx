import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { formatVND } from '../utils/format';

interface WishlistDrawerProps {
  onNavigate: (path: string) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({ onNavigate }) => {
  const { wishlistProducts, isOpen, closeWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (product: any) => {
    addToCart(product, 1, undefined, product.colors?.[0]?.name, product.sizes?.[0], true);
    removeFromWishlist(product.id);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="wishlist-drawer-container" className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeWishlist}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Drawer Content */}
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
                  <Heart className="w-5 h-5 text-[#111111] fill-current" />
                  <h2 className="font-serif-luxury text-xl font-medium tracking-wide">
                    Danh sách yêu thích
                  </h2>
                  <span className="text-xs text-neutral-500 font-sans-clean">
                    ({wishlistProducts.length})
                  </span>
                </div>
                <button
                  onClick={closeWishlist}
                  className="p-1.5 text-neutral-500 hover:text-black transition-colors cursor-pointer"
                  aria-label="Đóng danh sách yêu thích"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 divide-y divide-neutral-200/80">
                {wishlistProducts.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
                    <div className="w-16 h-16 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center mb-4 text-neutral-400">
                      <Heart className="w-8 h-8 stroke-[1.5]" />
                    </div>
                    <p className="font-serif-luxury text-lg font-medium text-neutral-800 mb-1">
                      Chưa có sản phẩm yêu thích
                    </p>
                    <p className="text-xs text-neutral-500 font-sans-clean max-w-xs mb-6">
                      Lưu lại những món đồ thời trang và phụ kiện yêu thích để xem lại bất cứ lúc nào.
                    </p>
                    <button
                      onClick={() => {
                        closeWishlist();
                        onNavigate('/products');
                      }}
                      className="px-6 py-2.5 bg-[#111111] text-white text-xs font-semibold tracking-widest uppercase hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      Khám phá bộ sưu tập
                    </button>
                  </div>
                ) : (
                  wishlistProducts.map((product) => (
                    <div key={product.id} className="pt-4 first:pt-0 flex gap-4">
                      {/* Thumbnail */}
                      <div
                        onClick={() => {
                          closeWishlist();
                          onNavigate(`/products/${product.slug}`);
                        }}
                        className="w-20 h-24 sm:w-24 sm:h-28 shrink-0 bg-neutral-100 border border-neutral-200 overflow-hidden cursor-pointer"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover object-center"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3
                              onClick={() => {
                                closeWishlist();
                                onNavigate(`/products/${product.slug}`);
                              }}
                              className="text-xs sm:text-sm font-sans-clean font-medium text-neutral-900 line-clamp-1 hover:underline cursor-pointer"
                            >
                              {product.name}
                            </h3>
                            <button
                              onClick={() => removeFromWishlist(product.id)}
                              className="text-neutral-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                              title="Xóa khỏi yêu thích"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <span className="text-[11px] text-neutral-500 uppercase tracking-wider block mt-0.5">
                            {product.category}
                          </span>

                          <p className="text-xs font-sans-clean font-semibold text-[#111111] mt-1">
                            {formatVND(product.price)}
                          </p>
                        </div>

                        {/* Add to Cart CTA */}
                        <div className="pt-2">
                          <button
                            onClick={() => handleMoveToCart(product)}
                            disabled={product.stock <= 0}
                            className="w-full py-2 px-3 bg-[#111111] disabled:bg-neutral-300 text-white text-[11px] font-semibold tracking-wider uppercase hover:bg-black transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>{product.stock > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
