import React, { useState } from 'react';
import { ArrowRight, ChevronRight, Eye, ShoppingBag } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { CategorySection } from '../components/CategorySection';
import { WhyCMSection } from '../components/WhyCMSection';
import { useShop } from '../context/ShopContext';
import { useCart } from '../context/CartContext';
import { formatVND } from '../utils/format';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { products, openQuickView } = useShop();
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState<'featured' | 'new' | 'bestseller'>('featured');

  // Filter products for homepage section
  const featuredProducts = products.filter((p) => {
    if (activeTab === 'new') return p.isNew;
    if (activeTab === 'bestseller') return p.rating >= 4.8;
    return p.isFeatured || p.isNew;
  }).slice(0, 8);

  // Lead spotlight product for the Geometric Balance hero sidebar
  const spotlightProduct = products.find((p) => p.category === 'Đồng hồ') || products[0];

  return (
    <div className="flex flex-col min-h-screen bg-[#F9F9F7] text-[#1A1A1A]">
      {/* ==================================================
          1. GEOMETRIC BALANCE SPLIT HERO SECTION
      ================================================== */}
      <section
        id="hero-section"
        className="pt-20 border-b border-[#E5E5E1] bg-white overflow-hidden"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-5rem)] border-x border-[#E5E5E1]">
          {/* Left Column: Architectural Typographic Statement */}
          <div className="lg:col-span-7 flex flex-col justify-center px-8 sm:px-14 lg:px-16 py-14 sm:py-20 relative lg:border-r border-[#E5E5E1] bg-white">
            <div className="mb-6 sm:mb-8">
              <span className="text-[10px] sm:text-[11px] tracking-[0.4em] text-neutral-400 uppercase font-bold">
                CM QUALITY PRODUCTS
              </span>
            </div>

            <h1 className="text-6xl sm:text-8xl lg:text-[102px] leading-[0.9] font-serif tracking-tighter text-[#1A1A1A] mb-6">
              CM
              <br />
              <span className="italic font-normal text-5xl sm:text-7xl lg:text-[76px] text-neutral-800">
                Quality
              </span>
            </h1>

            <p className="text-base sm:text-lg font-light text-neutral-500 max-w-md mb-10 leading-relaxed italic">
              "Chất lượng tốt. Giá trị xứng đáng."
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={() => onNavigate('/products')}
                className="bg-[#1A1A1A] text-white px-8 sm:px-10 py-4 text-[11px] uppercase tracking-[0.2em] font-semibold hover:bg-neutral-800 transition-colors cursor-pointer text-center"
              >
                Khám phá bộ sưu tập
              </button>
              <button
                onClick={() => onNavigate('/products')}
                className="border border-[#1A1A1A] text-[#1A1A1A] px-8 sm:px-10 py-4 text-[11px] uppercase tracking-[0.2em] font-semibold hover:bg-[#1A1A1A] hover:text-white transition-all cursor-pointer text-center"
              >
                Xem sản phẩm
              </button>
            </div>

            {/* Micro aesthetic specs bottom indicator */}
            <div className="mt-14 pt-8 border-t border-[#E5E5E1] flex items-center justify-between text-[10px] tracking-[0.2em] uppercase font-bold text-neutral-400">
              <span>Hà Nội • TP. Hồ Chí Minh</span>
              <span>Phiên bản Giới hạn</span>
            </div>
          </div>

          {/* Right Column: Geometric Spotlight Product & Spatial Accent */}
          <div className="lg:col-span-5 flex flex-col bg-[#F9F9F7] p-8 sm:p-12 justify-between relative overflow-hidden border-t lg:border-t-0 border-[#E5E5E1]">
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-[10px] tracking-[0.3em] font-bold uppercase text-[#1A1A1A]">
                Tiêu điểm thiết kế
              </h2>
              <button
                onClick={() => onNavigate('/products')}
                className="text-[10px] uppercase border-b border-black pb-0.5 font-bold tracking-wider hover:opacity-70 transition-opacity cursor-pointer"
              >
                Xem tất cả
              </button>
            </div>

            {spotlightProduct && (
              <div className="my-auto py-4">
                <div
                  onClick={() => onNavigate(`/products/${spotlightProduct.slug}`)}
                  className="group cursor-pointer block"
                >
                  <div className="aspect-[4/5] bg-[#EBEAE6] mb-4 relative overflow-hidden flex items-center justify-center border border-[#E5E5E1]">
                    <img
                      src={spotlightProduct.images[0]}
                      alt={spotlightProduct.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* Geometric Badges */}
                    <div className="absolute top-4 left-4 bg-[#1A1A1A] text-white text-[9px] px-3 py-1 uppercase tracking-widest font-bold">
                      Spotlight
                    </div>

                    {/* Quick action button bottom bar */}
                    <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xs p-3.5 transform translate-y-full group-hover:translate-y-0 transition-transform flex gap-2 border-t border-[#E5E5E1]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openQuickView(spotlightProduct);
                        }}
                        className="flex-1 text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] flex items-center justify-center gap-1.5 hover:opacity-75"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Xem nhanh</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(spotlightProduct, 1);
                        }}
                        className="px-4 py-2 bg-[#1A1A1A] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-800"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-start pt-1">
                    <div>
                      <p className="text-[10px] text-neutral-400 uppercase tracking-widest mb-1 font-medium">
                        {spotlightProduct.category}
                      </p>
                      <h3 className="text-sm font-medium text-[#1A1A1A] group-hover:underline">
                        {spotlightProduct.name}
                      </h3>
                    </div>
                    <p className="text-sm font-semibold text-[#1A1A1A]">
                      {formatVND(spotlightProduct.price)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Vertical Accent Label */}
            <div className="hidden sm:block absolute bottom-24 right-4 rotate-90 origin-right pointer-events-none opacity-40">
              <span className="text-[9px] tracking-[0.45em] text-neutral-500 uppercase font-bold">
                ESTABLISHED MMXXIV
              </span>
            </div>

            {/* Minimal Sub-Pillar */}
            <div className="pt-4 border-t border-[#E5E5E1] flex items-center justify-between text-[10px] tracking-widest text-neutral-500 uppercase font-medium">
              <span>Chế tác thủ công</span>
              <span>Bảo hành chính hãng</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          2. FEATURED PRODUCTS SECTION (Geometric Balance)
      ================================================== */}
      <section id="featured-products" className="py-20 sm:py-24 bg-[#F9F9F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10">
          {/* Section Header with Tabs */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[#E5E5E1] gap-6">
            <div>
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-neutral-400 block mb-2">
                Tuyển Chọn Cao Cấp
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#1A1A1A]">
                Sản phẩm nổi bật
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center space-x-6 text-[11px] uppercase tracking-[0.2em] font-semibold">
              <button
                onClick={() => setActiveTab('featured')}
                className={`py-1 cursor-pointer transition-opacity ${
                  activeTab === 'featured'
                    ? 'font-bold text-[#1A1A1A] border-b-2 border-[#1A1A1A] opacity-100'
                    : 'text-neutral-500 hover:text-[#1A1A1A] opacity-70 hover:opacity-100'
                }`}
              >
                Nổi bật
              </button>
              <button
                onClick={() => setActiveTab('new')}
                className={`py-1 cursor-pointer transition-opacity ${
                  activeTab === 'new'
                    ? 'font-bold text-[#1A1A1A] border-b-2 border-[#1A1A1A] opacity-100'
                    : 'text-neutral-500 hover:text-[#1A1A1A] opacity-70 hover:opacity-100'
                }`}
              >
                Mới ra mắt
              </button>
              <button
                onClick={() => setActiveTab('bestseller')}
                className={`py-1 cursor-pointer transition-opacity ${
                  activeTab === 'bestseller'
                    ? 'font-bold text-[#1A1A1A] border-b-2 border-[#1A1A1A] opacity-100'
                    : 'text-neutral-500 hover:text-[#1A1A1A] opacity-70 hover:opacity-100'
                }`}
              >
                Bán chạy nhất
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
            ))}
          </div>

          {/* View More Button */}
          <div className="mt-14 text-center">
            <button
              onClick={() => onNavigate('/products')}
              className="px-10 py-4 bg-transparent border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white text-[11px] font-semibold tracking-[0.2em] uppercase transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Xem tất cả {products.length} sản phẩm</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ==================================================
          3. CATEGORIES SHOWCASE
      ================================================== */}
      <CategorySection onNavigate={onNavigate} />

      {/* ==================================================
          4. EDITORIAL LOOKBOOK / CRAFTSMANSHIP BANNER
      ================================================== */}
      <section id="editorial-banner" className="relative py-24 sm:py-28 bg-[#1A1A1A] text-white overflow-hidden border-y border-[#E5E5E1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[10px] font-bold tracking-[0.35em] uppercase text-neutral-400 block">
                Triết Lý Thiết Kế
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
                Nghệ thuật của sự tối giản & độ hoàn thiện tuyệt đối.
              </h2>
              <p className="text-sm text-neutral-300 font-light leading-relaxed max-w-lg">
                Tại CM, chúng tôi loại bỏ tất cả những chi tiết rườm rà để giữ lại bản nguyên thuần khiết nhất của vật liệu: Da bê nguyên tấm từ vùng Tuscany, bạc Sterling 925, và sợi cotton Ai Cập chải kỹ.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('/lookbook')}
                  className="px-10 py-4 bg-white text-[#1A1A1A] hover:bg-[#F9F9F7] text-[11px] font-semibold tracking-[0.2em] uppercase transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Khám phá Lookbook 2026</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] bg-neutral-900 border border-neutral-700 overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop"
                  alt="CM Craftsmanship"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          5. TRUST SECTION ("Why CM")
      ================================================== */}
      <WhyCMSection />
    </div>
  );
};

