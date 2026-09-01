import React, { useState, useMemo } from 'react';
import { ProductCard } from '../components/ProductCard';
import { useShop } from '../context/ShopContext';
import { ProductCategory, Product } from '../types';
import { CATEGORIES_DATA } from '../data/categories';
import { Filter, X, SlidersHorizontal, ArrowUpDown, Check, RotateCcw } from 'lucide-react';
import { formatVND } from '../utils/format';

interface ProductsPageProps {
  initialCategory?: ProductCategory;
  onNavigate: (path: string) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ initialCategory, onNavigate }) => {
  const { products } = useShop();

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'ALL');
  const [pricePreset, setPricePreset] = useState<string>('ALL');
  const [onlyNew, setOnlyNew] = useState(false);
  const [onlySale, setOnlySale] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [searchFilter, setSearchFilter] = useState('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter and Sort calculation
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category Filter
    if (selectedCategory !== 'ALL') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Search query filter
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Price preset filter
    if (pricePreset === 'under-1m') {
      result = result.filter((p) => p.price < 1000000);
    } else if (pricePreset === '1m-2m') {
      result = result.filter((p) => p.price >= 1000000 && p.price <= 2000000);
    } else if (pricePreset === '2m-4m') {
      result = result.filter((p) => p.price > 2000000 && p.price <= 4000000);
    } else if (pricePreset === 'above-4m') {
      result = result.filter((p) => p.price > 4000000);
    }

    // Only new
    if (onlyNew) {
      result = result.filter((p) => p.isNew);
    }

    // Only sale
    if (onlySale) {
      result = result.filter((p) => p.originalPrice && p.originalPrice > p.price);
    }

    // Only in stock
    if (onlyInStock) {
      result = result.filter((p) => p.stock > 0);
    }

    // Min rating
    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating);
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'best-selling':
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'top-rated':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
      default:
        // Newest items first
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
    }

    return result;
  }, [
    products,
    selectedCategory,
    pricePreset,
    onlyNew,
    onlySale,
    onlyInStock,
    minRating,
    searchFilter,
    sortBy,
  ]);

  // Paginated chunk
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleResetFilters = () => {
    setSelectedCategory('ALL');
    setPricePreset('ALL');
    setOnlyNew(false);
    setOnlySale(false);
    setOnlyInStock(false);
    setMinRating(0);
    setSearchFilter('');
    setSortBy('newest');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    selectedCategory !== 'ALL' ||
    pricePreset !== 'ALL' ||
    onlyNew ||
    onlySale ||
    onlyInStock ||
    minRating > 0 ||
    searchFilter !== '';

  return (
    <div className="pt-24 sm:pt-28 pb-20 bg-[#FAFAFA] min-h-screen text-[#111111]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] font-sans-clean font-semibold tracking-[0.25em] uppercase text-neutral-400 block mb-2">
            Danh Mục Sản Phẩm CM
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-5xl font-medium text-neutral-900 tracking-wide">
            {selectedCategory === 'ALL' ? 'Tất cả sản phẩm' : selectedCategory}
          </h1>
          <p className="text-xs text-neutral-500 font-sans-clean mt-2">
            Tuyển chọn những thiết kế tối giản, chất lượng hoàn hảo và độ bền vượt thời gian.
          </p>
        </div>

        {/* Toolbar Bar: Filters & Sort & Results Count */}
        <div className="bg-white border border-neutral-200 p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden px-4 py-2 bg-neutral-100 text-neutral-800 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border border-neutral-300 cursor-pointer"
            >
              <Filter className="w-4 h-4" />
              <span>Bộ lọc ({hasActiveFilters ? 'Đang lọc' : 'Tất cả'})</span>
            </button>

            <span className="text-xs text-neutral-600 font-sans-clean">
              Hiển thị <strong>{filteredProducts.length}</strong> sản phẩm
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {/* Search within catalog */}
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => {
                setSearchFilter(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Lọc theo từ khóa..."
              className="bg-neutral-50 border border-neutral-300 px-3 py-1.5 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black max-w-[180px] sm:max-w-xs"
            />

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-neutral-50 border border-neutral-300 px-3 py-1.5 text-xs text-neutral-800 focus:outline-none focus:border-black cursor-pointer uppercase tracking-wider"
              >
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá: Thấp → Cao</option>
                <option value="price-desc">Giá: Cao → Thấp</option>
                <option value="best-selling">Bán chạy nhất</option>
                <option value="top-rated">Đánh giá cao nhất</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Grid with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Desktop Left Sidebar Filters */}
          <aside className="hidden lg:block lg:col-span-3 space-y-8 bg-white border border-neutral-200 p-6 h-fit sticky top-28">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-neutral-800" />
                <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-900">
                  Bộ lọc sản phẩm
                </h3>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] text-neutral-500 hover:text-black flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Đặt lại</span>
                </button>
              )}
            </div>

            {/* 1. Category Filter */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-800 mb-3">
                Danh mục
              </h4>
              <div className="space-y-1.5 text-xs font-sans-clean">
                <button
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setCurrentPage(1);
                  }}
                  className={`w-full text-left py-1 px-2 rounded-none transition-colors cursor-pointer flex justify-between items-center ${
                    selectedCategory === 'ALL'
                      ? 'bg-neutral-900 text-white font-medium'
                      : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
                  }`}
                >
                  <span>Tất cả danh mục</span>
                  <span className="text-[11px] opacity-75">({products.length})</span>
                </button>
                {CATEGORIES_DATA.map((c) => {
                  const count = products.filter((p) => p.category === c.name).length;
                  return (
                    <button
                      key={c.slug}
                      onClick={() => {
                        setSelectedCategory(c.name);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left py-1 px-2 transition-colors cursor-pointer flex justify-between items-center ${
                        selectedCategory === c.name
                          ? 'bg-neutral-900 text-white font-medium'
                          : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
                      }`}
                    >
                      <span>{c.name}</span>
                      <span className="text-[11px] opacity-75">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Price Presets */}
            <div className="pt-4 border-t border-neutral-200">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-800 mb-3">
                Khoảng giá (VND)
              </h4>
              <div className="space-y-2 text-xs font-sans-clean">
                {[
                  { label: 'Tất cả mức giá', value: 'ALL' },
                  { label: 'Dưới 1.000.000₫', value: 'under-1m' },
                  { label: '1.000.000₫ - 2.000.000₫', value: '1m-2m' },
                  { label: '2.000.000₫ - 4.000.000₫', value: '2m-4m' },
                  { label: 'Trên 4.000.000₫', value: 'above-4m' },
                ].map((preset) => (
                  <label
                    key={preset.value}
                    className="flex items-center gap-2 cursor-pointer text-neutral-700 hover:text-black"
                  >
                    <input
                      type="radio"
                      name="pricePreset"
                      checked={pricePreset === preset.value}
                      onChange={() => {
                        setPricePreset(preset.value);
                        setCurrentPage(1);
                      }}
                      className="accent-neutral-900"
                    />
                    <span>{preset.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 3. Quick Checkboxes */}
            <div className="pt-4 border-t border-neutral-200 space-y-2.5 text-xs font-sans-clean">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-800 mb-3">
                Đặc tính
              </h4>
              <label className="flex items-center gap-2.5 cursor-pointer text-neutral-700 hover:text-black">
                <input
                  type="checkbox"
                  checked={onlyNew}
                  onChange={(e) => {
                    setOnlyNew(e.target.checked);
                    setCurrentPage(1);
                  }}
                  className="accent-neutral-900 w-3.5 h-3.5"
                />
                <span>Sản phẩm mới ra mắt</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-neutral-700 hover:text-black">
                <input
                  type="checkbox"
                  checked={onlySale}
                  onChange={(e) => {
                    setOnlySale(e.target.checked);
                    setCurrentPage(1);
                  }}
                  className="accent-neutral-900 w-3.5 h-3.5"
                />
                <span>Đang giảm giá</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-neutral-700 hover:text-black">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => {
                    setOnlyInStock(e.target.checked);
                    setCurrentPage(1);
                  }}
                  className="accent-neutral-900 w-3.5 h-3.5"
                />
                <span>Chỉ hiện sản phẩm còn hàng</span>
              </label>
            </div>
          </aside>

          {/* Right Product Grid */}
          <main className="lg:col-span-9">
            {paginatedProducts.length === 0 ? (
              <div className="bg-white border border-neutral-200 p-12 text-center my-8">
                <p className="font-serif-luxury text-xl text-neutral-900 mb-2">
                  Không tìm thấy sản phẩm nào phù hợp
                </p>
                <p className="text-xs text-neutral-500 font-sans-clean max-w-sm mx-auto mb-6">
                  Vui lòng thử điều chỉnh lại bộ lọc hoặc từ khóa tìm kiếm để xem các thiết kế khác.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 bg-[#111111] text-white text-xs font-semibold tracking-widest uppercase hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2 text-xs font-semibold">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white border border-neutral-300 text-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-100 uppercase tracking-wider cursor-pointer"
                >
                  Trước
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-9 h-9 border flex items-center justify-center transition-colors cursor-pointer ${
                      currentPage === pageNum
                        ? 'bg-[#111111] text-white border-black'
                        : 'bg-white text-neutral-700 border-neutral-300 hover:border-black'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white border border-neutral-300 text-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-100 uppercase tracking-wider cursor-pointer"
                >
                  Sau
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl z-10 flex flex-col p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-900">
                Bộ lọc sản phẩm
              </h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 text-neutral-500 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile filter items */}
            <div className="py-6 space-y-6 flex-1">
              <div>
                <h4 className="text-xs font-semibold uppercase text-neutral-800 mb-2">Danh mục</h4>
                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => {
                      setSelectedCategory('ALL');
                      setIsMobileFilterOpen(false);
                    }}
                    className={`w-full text-left py-1.5 px-2 ${
                      selectedCategory === 'ALL' ? 'bg-black text-white font-medium' : 'text-neutral-700'
                    }`}
                  >
                    Tất cả danh mục
                  </button>
                  {CATEGORIES_DATA.map((c) => (
                    <button
                      key={c.slug}
                      onClick={() => {
                        setSelectedCategory(c.name);
                        setIsMobileFilterOpen(false);
                      }}
                      className={`w-full text-left py-1.5 px-2 ${
                        selectedCategory === c.name ? 'bg-black text-white font-medium' : 'text-neutral-700'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200">
                <h4 className="text-xs font-semibold uppercase text-neutral-800 mb-2">Khoảng giá</h4>
                <div className="space-y-2 text-xs">
                  {[
                    { label: 'Tất cả mức giá', value: 'ALL' },
                    { label: 'Dưới 1.000.000₫', value: 'under-1m' },
                    { label: '1.000.000₫ - 2.000.000₫', value: '1m-2m' },
                    { label: '2.000.000₫ - 4.000.000₫', value: '2m-4m' },
                    { label: 'Trên 4.000.000₫', value: 'above-4m' },
                  ].map((p) => (
                    <label key={p.value} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="mobilePrice"
                        checked={pricePreset === p.value}
                        onChange={() => setPricePreset(p.value)}
                        className="accent-black"
                      />
                      <span>{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-200">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 bg-black text-white text-xs font-semibold tracking-wider uppercase"
              >
                Áp dụng bộ lọc ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
