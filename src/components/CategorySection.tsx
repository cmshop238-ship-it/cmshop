import React from 'react';
import { CATEGORIES_DATA } from '../data/categories';
import { ArrowUpRight } from 'lucide-react';

interface CategorySectionProps {
  onNavigate: (path: string) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({ onNavigate }) => {
  return (
    <section id="categories-showcase" className="py-20 sm:py-24 bg-white border-y border-[#E5E5E1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[#E5E5E1]">
          <div>
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-neutral-400 block mb-2">
              Bộ Sưu Tập Tuyển Chọn
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#1A1A1A]">
              Danh mục sản phẩm
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/products')}
            className="mt-4 md:mt-0 text-[11px] font-semibold tracking-[0.2em] uppercase text-[#1A1A1A] hover:opacity-70 flex items-center gap-1.5 cursor-pointer group"
          >
            <span>Xem tất cả danh mục</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Dynamic Category Grid with Geometric Framing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {CATEGORIES_DATA.map((cat) => (
            <div
              key={cat.slug}
              onClick={() => onNavigate(`/category/${cat.slug}`)}
              className="group relative aspect-[4/5] overflow-hidden bg-[#EBEAE6] cursor-pointer border border-[#E5E5E1]"
            >
              {/* Background Image */}
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Geometric Gradient & Framing */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Content Overlay */}
              <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end text-white">
                <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-300 mb-1 block font-semibold">
                  {cat.itemCount} Thiết kế
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1.5">
                  {cat.name}
                </h3>
                <p className="text-xs text-neutral-200 line-clamp-1 mb-4 opacity-90 font-light">
                  {cat.tagline}
                </p>

                <div className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-white group-hover:underline pt-1">
                  <span>Khám phá ngay</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

