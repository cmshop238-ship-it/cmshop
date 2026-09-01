import React from 'react';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';
import { Product } from '../types';
import { formatVND, calculateDiscountPercent } from '../utils/format';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
  product: Product;
  onNavigate: (path: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onNavigate }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { openQuickView } = useShop();

  const isFavorite = isInWishlist(product.id);
  const discountPercent = calculateDiscountPercent(product.originalPrice, product.price);
  const isOutOfStock = product.stock <= 0;

  const handleCardClick = (e: React.MouseEvent) => {
    // Avoid triggering when buttons inside are clicked
    if ((e.target as HTMLElement).closest('button')) return;
    onNavigate(`/products/${product.slug}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    const defaultColor = product.colors?.[0]?.name;
    const defaultSize = product.sizes?.[0];
    addToCart(product, 1, undefined, defaultColor, defaultSize, true);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    openQuickView(product);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={handleCardClick}
      className="group relative flex flex-col bg-transparent text-[#1A1A1A] cursor-pointer"
    >
      {/* Geometric Image Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#EBEAE6] border border-[#E5E5E1]">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Secondary image hover transition if present */}
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={`${product.name} - alternate angle`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-center opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100"
          />
        )}

        {/* Geometric Sharp Badges (Top Left) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.isNew && (
            <span className="bg-[#1A1A1A] text-white text-[9px] px-2.5 py-1 uppercase tracking-widest font-bold">
              New
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-[#1A1A1A] text-white text-[9px] px-2.5 py-1 uppercase tracking-widest font-bold">
              -{discountPercent}%
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-stone-800 text-white text-[9px] px-2.5 py-1 uppercase tracking-widest font-bold">
              Hết hàng
            </span>
          )}
        </div>

        {/* Wishlist Button (Top Right) */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 z-10 cursor-pointer ${
            isFavorite
              ? 'bg-[#1A1A1A] text-white'
              : 'bg-white/90 text-neutral-800 hover:bg-white hover:text-black opacity-90 sm:opacity-0 sm:group-hover:opacity-100'
          }`}
          aria-label={isFavorite ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
        >
          <Heart className={`w-4 h-4 stroke-[1.5] ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Geometric Quick Action Overlay (Bottom) */}
        <div className="absolute inset-x-0 bottom-0 p-3 flex gap-2 translate-y-full sm:group-hover:translate-y-0 transition-transform duration-300 ease-out bg-white/95 backdrop-blur-xs border-t border-[#E5E5E1] z-10">
          <button
            onClick={handleQuickView}
            className="flex-1 py-2 px-3 bg-transparent text-[#1A1A1A] hover:opacity-75 text-[10px] font-bold tracking-widest uppercase transition-opacity flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Xem nhanh</span>
          </button>

          {!isOutOfStock && (
            <button
              onClick={handleAddToCart}
              className="p-2 bg-[#1A1A1A] text-white hover:bg-neutral-800 text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center cursor-pointer"
              title="Thêm vào giỏ"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Product Information with Clean Geometric Alignment */}
      <div className="pt-3.5 pb-1 flex flex-col space-y-1 text-left">
        <div className="flex items-center justify-between text-[10px] text-neutral-400 uppercase tracking-widest font-medium">
          <span>{product.category}</span>
          <div className="flex items-center gap-1 text-neutral-700">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-[10px]">{product.rating}</span>
            <span className="text-neutral-400 text-[9px]">({product.reviewCount})</span>
          </div>
        </div>

        <h3 className="text-sm font-medium text-[#1A1A1A] group-hover:underline transition-all line-clamp-1">
          {product.name}
        </h3>

        {/* Price Row */}
        <div className="flex items-baseline gap-2 pt-0.5">
          <span className="text-sm font-semibold text-[#1A1A1A]">
            {formatVND(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-neutral-400 line-through font-normal">
              {formatVND(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Color Indicators */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1.5 pt-1">
            {product.colors.map((c, i) => (
              <span
                key={i}
                title={c.name}
                className="w-2.5 h-2.5 rounded-full border border-neutral-300"
                style={{ backgroundColor: c.hex }}
              />
            ))}
            {product.colors.length > 3 && (
              <span className="text-[9px] text-neutral-400">+{product.colors.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

