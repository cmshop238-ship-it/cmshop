import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatVND } from '../utils/format';

interface SearchModalProps {
  onNavigate: (path: string) => void;
}

const POPULAR_SEARCHES = [
  'Đồng hồ Casio',
  'Sneaker Minimal',
  'Túi Shoulder',
  'Áo Oversize',
  'Tai nghe Wireless',
  'Balo Minimal',
];

export const SearchModal: React.FC<SearchModalProps> = ({ onNavigate }) => {
  const { products, isSearchOpen, closeSearch } = useShop();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isSearchOpen) {
      setQuery('');
    }
  }, [isSearchOpen]);

  // Real-time multi-attribute search
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return products.filter((p) => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchCategory = p.category.toLowerCase().includes(q);
      const matchSku = p.sku.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q);
      return matchName || matchCategory || matchSku || matchDesc;
    });
  }, [query, products]);

  const handleSelectProduct = (slug: string) => {
    closeSearch();
    onNavigate(`/products/${slug}`);
  };

  const handleKeywordClick = (keyword: string) => {
    setQuery(keyword);
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <div id="search-modal-container" className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeSearch}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
          />

          {/* Modal Box */}
          <div className="min-h-screen px-4 text-center flex items-start justify-center pt-16 sm:pt-24 pb-12">
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-3xl bg-[#FAFAFA] text-[#111111] shadow-2xl z-10 text-left border border-neutral-200 overflow-hidden"
            >
              {/* Search Input Bar */}
              <div className="relative border-b border-neutral-200 bg-white p-4 sm:p-6 flex items-center gap-3">
                <Search className="w-5 h-5 text-neutral-400 shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm, danh mục, SKU, phong cách..."
                  autoFocus
                  className="w-full bg-transparent text-base sm:text-lg font-sans-clean placeholder-neutral-400 text-neutral-900 focus:outline-none"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="p-1 text-neutral-400 hover:text-black cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={closeSearch}
                  className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-neutral-500 hover:text-black cursor-pointer border border-neutral-200"
                >
                  Đóng
                </button>
              </div>

              {/* Suggestions / Results Body */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {!query.trim() ? (
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-3">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Gợi ý tìm kiếm thịnh hành</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_SEARCHES.map((term) => (
                        <button
                          key={term}
                          onClick={() => handleKeywordClick(term)}
                          className="px-3.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-xs text-neutral-800 transition-colors cursor-pointer border border-neutral-200/80"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between text-xs text-neutral-500 font-sans-clean mb-4">
                      <span>
                        Kết quả tìm kiếm cho "<strong>{query}</strong>"
                      </span>
                      <span>({searchResults.length} sản phẩm)</span>
                    </div>

                    {searchResults.length === 0 ? (
                      <div className="py-12 text-center text-neutral-500">
                        <p className="font-serif-luxury text-lg text-neutral-800 mb-1">
                          Không tìm thấy sản phẩm phù hợp
                        </p>
                        <p className="text-xs">
                          Thử tìm kiếm với từ khóa khác như "đồng hồ", "giày", "túi", "balo" hoặc "áo".
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {searchResults.map((product) => (
                          <div
                            key={product.id}
                            onClick={() => handleSelectProduct(product.slug)}
                            className="flex items-center gap-3 p-2.5 bg-white border border-neutral-200 hover:border-black transition-all cursor-pointer group"
                          >
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-14 h-16 object-cover bg-neutral-100 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">
                                {product.category}
                              </span>
                              <h4 className="text-xs font-medium text-neutral-900 line-clamp-1 group-hover:text-black">
                                {product.name}
                              </h4>
                              <p className="text-xs font-semibold text-[#111111] mt-0.5">
                                {formatVND(product.price)}
                              </p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-black transition-colors shrink-0" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
