import React, { useState, useEffect } from 'react';
import {
  Star,
  ShoppingBag,
  Heart,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
  ChevronRight,
  Share2,
  Sparkles,
  MessageSquarePlus,
  ArrowRight,
  Minus,
  Plus
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { ProductCard } from '../components/ProductCard';
import { formatVND, calculateDiscountPercent, formatDate } from '../utils/format';

interface ProductDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug, onNavigate }) => {
  const { getProductBySlug, products, addReview } = useShop();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { success, error } = useToast();

  const product = getProductBySlug(slug) || products[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'shipping' | 'returns' | 'reviews'>('desc');

  // New review form
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (product) {
      setActiveImageIndex(0);
      setSelectedColor(product.colors?.[0]?.name || '');
      setSelectedSize(product.sizes?.[0] || '');
      setQuantity(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [product, slug]);

  if (!product) {
    return (
      <div className="pt-32 pb-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="font-serif-luxury text-2xl mb-2">Không tìm thấy sản phẩm</h2>
        <button
          onClick={() => onNavigate('/products')}
          className="px-6 py-2.5 bg-black text-white text-xs uppercase tracking-wider mt-4"
        >
          Quay lại danh mục
        </button>
      </div>
    );
  }

  const discount = calculateDiscountPercent(product.originalPrice, product.price);
  const isFavorite = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity, undefined, selectedColor, selectedSize, true);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity, undefined, selectedColor, selectedSize, false);
    onNavigate('/checkout');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.shortDescription,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      success('Đã sao chép liên kết sản phẩm vào bộ nhớ tạm.');
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) {
      error('Vui lòng nhập tên và nhận xét của bạn.');
      return;
    }
    setIsSubmittingReview(true);
    addReview(product.id, {
      userName: reviewName.trim(),
      rating: reviewRating,
      comment: reviewComment.trim(),
    });
    setReviewName('');
    setReviewComment('');
    setReviewRating(5);
    setIsSubmittingReview(false);
  };

  // Related items
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="pt-24 sm:pt-28 pb-20 bg-[#FAFAFA] min-h-screen text-[#111111]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-xs text-neutral-500 mb-8 overflow-x-auto whitespace-nowrap">
          <button onClick={() => onNavigate('/')} className="hover:text-black transition-colors cursor-pointer">
            Trang chủ
          </button>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <button onClick={() => onNavigate('/products')} className="hover:text-black transition-colors cursor-pointer">
            Sản phẩm
          </button>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <button
            onClick={() => onNavigate(`/category/${product.category}`)}
            className="hover:text-black transition-colors cursor-pointer"
          >
            {product.category}
          </button>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <span className="text-neutral-900 font-medium truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </span>
        </nav>

        {/* Product Main Display Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 mb-20">
          {/* Left: Interactive Image Gallery (Col 7) */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnails on left for desktop */}
            {product.images.length > 1 && (
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:w-20 shrink-0">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-20 sm:w-20 sm:h-24 bg-neutral-100 border transition-all overflow-hidden cursor-pointer shrink-0 ${
                      activeImageIndex === idx
                        ? 'border-black ring-1 ring-black'
                        : 'border-neutral-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Stage Image */}
            <div className="flex-1 relative aspect-[3/4] bg-neutral-100 border border-neutral-200 overflow-hidden group">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />

              {discount > 0 && (
                <span className="absolute top-4 left-4 px-3 py-1 text-xs font-semibold uppercase tracking-widest bg-[#111111] text-white">
                  -{discount}%
                </span>
              )}

              {product.isNew && (
                <span className="absolute top-4 right-4 px-3 py-1 text-xs font-semibold uppercase tracking-widest bg-white text-black border border-neutral-200">
                  Mới
                </span>
              )}
            </div>
          </div>

          {/* Right: Sticky Product Info & CTAs (Col 5) */}
          <div className="lg:col-span-5 flex flex-col justify-start space-y-6">
            <div>
              {/* Category & SKU */}
              <div className="flex items-center justify-between text-xs text-neutral-500 uppercase tracking-widest mb-2">
                <span>{product.category}</span>
                <span>SKU: {product.sku}</span>
              </div>

              {/* Title */}
              <h1 className="font-serif-luxury text-3xl sm:text-4xl font-medium text-neutral-900 leading-tight">
                {product.name}
              </h1>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${
                        star <= Math.round(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-neutral-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-neutral-800">{product.rating}</span>
                <span className="text-xs text-neutral-400">•</span>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className="text-xs text-neutral-600 hover:text-black underline underline-offset-2 cursor-pointer"
                >
                  {product.reviewCount} đánh giá xác thực
                </button>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mt-5 pb-5 border-b border-neutral-200">
                <span className="text-2xl sm:text-3xl font-bold font-sans-clean text-[#111111]">
                  {formatVND(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-base text-neutral-400 line-through">
                    {formatVND(product.originalPrice)}
                  </span>
                )}
                {discount > 0 && (
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                    Tiết kiệm {formatVND(product.originalPrice! - product.price)}
                  </span>
                )}
              </div>
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-neutral-600 font-sans-clean leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-800">
                    Màu sắc: <span className="font-normal text-neutral-600">{selectedColor}</span>
                  </span>
                </div>
                <div className="flex gap-2.5">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`w-8 h-8 rounded-full border-2 transition-all relative flex items-center justify-center cursor-pointer ${
                        selectedColor === c.name
                          ? 'border-black scale-110'
                          : 'border-neutral-300 hover:border-neutral-500'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                      {selectedColor === c.name && (
                        <Check
                          className={`w-4 h-4 ${
                            c.hex.toLowerCase() === '#ffffff' || c.hex.toLowerCase() === '#f5f5f0'
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

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-800">
                    Kích thước: <span className="font-normal text-neutral-600">{selectedSize}</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-4 py-2 text-xs font-medium border transition-colors cursor-pointer ${
                        selectedSize === s
                          ? 'bg-[#111111] text-white border-black'
                          : 'bg-white text-neutral-700 border-neutral-300 hover:border-black'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Indicator */}
            <div className="flex items-center gap-2 text-xs text-neutral-600">
              <span
                className={`w-2 h-2 rounded-full ${
                  product.stock > 5
                    ? 'bg-emerald-500'
                    : product.stock > 0
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
              />
              <span>
                {product.stock > 5
                  ? `Còn hàng (${product.stock} sản phẩm sẵn có)`
                  : product.stock > 0
                  ? `Cảnh báo: Chỉ còn ${product.stock} sản phẩm`
                  : 'Tạm hết hàng'}
              </span>
            </div>

            {/* Quantity and Primary Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-3">
                {/* Stepper */}
                <div className="flex items-center border border-neutral-300 bg-white">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-3 hover:bg-neutral-100 text-neutral-700 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-xs font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="p-3 hover:bg-neutral-100 text-neutral-700 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 py-3.5 bg-[#111111] disabled:bg-neutral-300 text-white hover:bg-black text-xs font-semibold tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed shadow-sm active:scale-[0.99]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ hàng'}</span>
                </button>

                {/* Wishlist button */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3.5 border transition-colors cursor-pointer ${
                    isFavorite
                      ? 'bg-[#111111] text-white border-black'
                      : 'bg-white text-neutral-700 border-neutral-300 hover:border-black'
                  }`}
                  aria-label="Thêm vào yêu thích"
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Buy Now Direct Button */}
              {!isOutOfStock && (
                <button
                  onClick={handleBuyNow}
                  className="w-full py-3.5 bg-neutral-900 text-white hover:bg-black text-xs font-semibold tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer border border-neutral-800"
                >
                  <span>Mua ngay (Thanh toán trực tiếp)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Guarantees Mini Strip */}
            <div className="grid grid-cols-3 gap-2 py-4 border-t border-neutral-200 text-[11px] text-neutral-600 text-center font-sans-clean">
              <div className="flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-neutral-800" />
                <span>Giao hỏa tốc</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw className="w-4 h-4 text-neutral-800" />
                <span>Đổi trả 30 ngày</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-neutral-800" />
                <span>Cam kết chính hãng</span>
              </div>
            </div>

            <button
              onClick={handleShare}
              className="text-xs text-neutral-500 hover:text-black flex items-center gap-1.5 cursor-pointer pt-1"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Chia sẻ sản phẩm này</span>
            </button>
          </div>
        </div>

        {/* Product Details Tabs (Mô tả, Thông tin kỹ thuật, Vận chuyển, Đổi trả, Đánh giá) */}
        <div className="bg-white border border-neutral-200 mb-20">
          {/* Tab Header */}
          <div className="flex border-b border-neutral-200 overflow-x-auto text-xs uppercase tracking-widest font-sans-clean">
            <button
              onClick={() => setActiveTab('desc')}
              className={`py-4 px-6 font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                activeTab === 'desc'
                  ? 'border-b-2 border-black text-black bg-neutral-50'
                  : 'text-neutral-500 hover:text-black'
              }`}
            >
              Mô tả chi tiết
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`py-4 px-6 font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                activeTab === 'specs'
                  ? 'border-b-2 border-black text-black bg-neutral-50'
                  : 'text-neutral-500 hover:text-black'
              }`}
            >
              Thông số kỹ thuật
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`py-4 px-6 font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                activeTab === 'shipping'
                  ? 'border-b-2 border-black text-black bg-neutral-50'
                  : 'text-neutral-500 hover:text-black'
              }`}
            >
              Vận chuyển & Giao nhận
            </button>
            <button
              onClick={() => setActiveTab('returns')}
              className={`py-4 px-6 font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                activeTab === 'returns'
                  ? 'border-b-2 border-black text-black bg-neutral-50'
                  : 'text-neutral-500 hover:text-black'
              }`}
            >
              Chính sách đổi trả
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 px-6 font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                activeTab === 'reviews'
                  ? 'border-b-2 border-black text-black bg-neutral-50'
                  : 'text-neutral-500 hover:text-black'
              }`}
            >
              Đánh giá ({product.reviews?.length || 0})
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 sm:p-10">
            {activeTab === 'desc' && (
              <div className="space-y-6 max-w-3xl text-neutral-700 leading-relaxed font-sans-clean text-sm">
                <p className="text-base font-medium text-neutral-900">
                  {product.description}
                </p>
                {product.features && (
                  <div>
                    <h4 className="font-semibold text-neutral-900 uppercase tracking-wider text-xs mb-3">
                      Đặc điểm nổi bật:
                    </h4>
                    <ul className="space-y-2 text-xs">
                      {product.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-black font-bold">•</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="max-w-2xl">
                <table className="w-full text-xs font-sans-clean border border-neutral-200">
                  <tbody>
                    {Object.entries(product.specifications || {}).map(([key, val], idx) => (
                      <tr key={key} className={idx % 2 === 0 ? 'bg-neutral-50' : 'bg-white'}>
                        <td className="py-3 px-4 font-semibold text-neutral-800 border-r border-neutral-200 w-1/3">
                          {key}
                        </td>
                        <td className="py-3 px-4 text-neutral-600">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="max-w-3xl space-y-4 text-xs font-sans-clean text-neutral-700 leading-relaxed">
                <h4 className="font-semibold text-neutral-900 uppercase tracking-wider text-xs">
                  Chính sách giao hàng toàn quốc:
                </h4>
                <p>
                  • <strong>Giao hàng tiêu chuẩn:</strong> Từ 2 - 4 ngày làm việc. Miễn phí cho tất cả đơn hàng từ 2.000.000₫ (áp dụng cước 30.000₫ cho đơn dưới 2 triệu).
                </p>
                <p>
                  • <strong>Giao hàng hỏa tốc (Nội thành TP.HCM & Hà Nội):</strong> Giao trong vòng 2 - 4 giờ làm việc. Cước phí 50.000₫.
                </p>
                <p>
                  • Mỗi kiện hàng được đóng trong hộp cứng signature CM kèm túi bọc bảo vệ chống nước.
                </p>
              </div>
            )}

            {activeTab === 'returns' && (
              <div className="max-w-3xl space-y-4 text-xs font-sans-clean text-neutral-700 leading-relaxed">
                <h4 className="font-semibold text-neutral-900 uppercase tracking-wider text-xs">
                  Đặc quyền đổi trả 30 ngày:
                </h4>
                <p>
                  • Đổi size hoặc đổi mẫu miễn phí trong 30 ngày kể từ ngày nhận hàng.
                </p>
                <p>
                  • Sản phẩm đổi trả cần còn nguyên vẹn tem mác, chưa qua sử dụng hoặc giặt tẩy, kèm đầy đủ phụ kiện và hóa đơn.
                </p>
                <p>
                  • Đội ngũ giao nhận của CM sẽ đến tận nơi lấy hàng đổi trả mà quý khách không phải di chuyển.
                </p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-10 max-w-4xl">
                {/* Review Header Stats */}
                <div className="flex flex-col sm:flex-row items-center gap-8 pb-8 border-b border-neutral-200">
                  <div className="text-center sm:text-left">
                    <span className="font-serif-luxury text-5xl font-medium text-neutral-900">
                      {product.rating}
                    </span>
                    <div className="flex items-center gap-1 my-1 justify-center sm:justify-start">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-neutral-500">Dựa trên {product.reviews?.length || 0} đánh giá</p>
                  </div>
                </div>

                {/* Existing Reviews List */}
                <div className="space-y-6 divide-y divide-neutral-200">
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((rev) => (
                      <div key={rev.id} className="pt-6 first:pt-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-neutral-900">{rev.userName}</span>
                            {rev.verifiedPurchase && (
                              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                                Đã mua hàng tại CM
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-neutral-400">{formatDate(rev.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3 h-3 ${
                                s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-neutral-700 font-sans-clean leading-relaxed">
                          {rev.comment}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-neutral-500 py-4">Chưa có đánh giá nào cho sản phẩm này.</p>
                  )}
                </div>

                {/* Submit New Review Form */}
                <div className="bg-neutral-50 border border-neutral-200 p-6 sm:p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <MessageSquarePlus className="w-4 h-4 text-neutral-800" />
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-900">
                      Gửi đánh giá của bạn
                    </h4>
                  </div>

                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-1">
                        Xếp hạng mức độ hài lòng:
                      </label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setReviewRating(star)}
                            className="p-1 cursor-pointer"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                star <= reviewRating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-neutral-300'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="text-xs font-medium text-neutral-600 ml-2">
                          {reviewRating === 5
                            ? 'Tuyệt vời (5 sao)'
                            : reviewRating === 4
                            ? 'Rất tốt (4 sao)'
                            : reviewRating === 3
                            ? 'Bình thường (3 sao)'
                            : 'Cần cải thiện'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                          Họ và tên của bạn *
                        </label>
                        <input
                          type="text"
                          value={reviewName}
                          onChange={(e) => setReviewName(e.target.value)}
                          placeholder="Nguyễn Văn A"
                          required
                          className="w-full bg-white border border-neutral-300 px-3 py-2 text-xs focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                        Nhận xét chi tiết *
                      </label>
                      <textarea
                        rows={3}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Chia sẻ cảm nhận của bạn về chất liệu, độ hoàn thiện và trải nghiệm sử dụng..."
                        required
                        className="w-full bg-white border border-neutral-300 px-3 py-2 text-xs focus:outline-none focus:border-black"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="px-6 py-2.5 bg-[#111111] text-white text-xs font-semibold tracking-widest uppercase hover:bg-black transition-colors cursor-pointer"
                    >
                      {isSubmittingReview ? 'Đang gửi...' : 'Gửi đánh giá'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-200">
              <h3 className="font-serif-luxury text-2xl sm:text-3xl font-medium text-neutral-900">
                Sản phẩm cùng danh mục
              </h3>
              <button
                onClick={() => onNavigate(`/category/${product.category}`)}
                className="text-xs font-semibold tracking-wider uppercase text-neutral-600 hover:text-black cursor-pointer"
              >
                Xem thêm
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
