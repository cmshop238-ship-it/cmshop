import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface LookbookPageProps {
  onNavigate: (path: string) => void;
}

export const LookbookPage: React.FC<LookbookPageProps> = ({ onNavigate }) => {
  const editorialShots = [
    {
      title: 'Monochrome Symphony',
      subtitle: 'Sự giao thoa giữa bóng tối và ánh sáng',
      category: 'Thời trang & Giày Da',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop',
      tag: 'SS 2026',
    },
    {
      title: 'Architectural Structure',
      subtitle: 'Túi xách và balo cắt laser hình học',
      category: 'Túi & Ví Da',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1200&auto=format&fit=crop',
      tag: 'AW 2026',
    },
    {
      title: 'Precision In Silence',
      subtitle: 'Đồng hồ cơ khí và trang sức bạc 925 tối giản',
      category: 'Đồng hồ & Phụ kiện',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop',
      tag: 'Iconic',
    },
  ];

  return (
    <div className="pt-24 sm:pt-28 pb-20 bg-[#FAFAFA] min-h-screen text-[#111111]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[11px] font-sans-clean font-semibold tracking-[0.3em] uppercase text-neutral-400 block mb-2">
            CM Visual Editorial
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-6xl font-normal text-neutral-900 leading-tight">
            Bộ Sưu Tập Lookbook 2026
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 font-sans-clean mt-3">
            Những góc nhìn nghệ thuật ghi lại hơi thở của nhịp sống hiện đại qua lăng kính tối giản của CM.
          </p>
        </div>

        {/* Editorial Stories */}
        <div className="space-y-24">
          {editorialShots.map((shot, idx) => (
            <div
              key={idx}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center ${
                idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className={`lg:col-span-7 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="relative aspect-[16/10] bg-neutral-900 overflow-hidden border border-neutral-200 shadow-xl group">
                  <img
                    src={shot.image}
                    alt={shot.title}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute top-4 left-4 px-3 py-1 bg-black text-white text-[10px] uppercase font-semibold tracking-widest">
                    {shot.tag}
                  </span>
                </div>
              </div>

              <div className={`lg:col-span-5 space-y-4 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                  {shot.category}
                </span>
                <h2 className="font-serif-luxury text-3xl sm:text-4xl font-medium text-neutral-900">
                  {shot.title}
                </h2>
                <p className="text-xs sm:text-sm text-neutral-600 font-sans-clean leading-relaxed">
                  {shot.subtitle}. Được thiết kế với tỷ lệ toán học hoàn hảo và kỹ thuật xử lý bề mặt mờ nhung độc quyền.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => onNavigate('/products')}
                    className="px-6 py-3 bg-[#111111] text-white hover:bg-black text-xs font-semibold tracking-widest uppercase transition-all inline-flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>Xem các sản phẩm trong bộ ảnh</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
