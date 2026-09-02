import React, { useState } from 'react';
import { Logo } from './Logo';
import { useToast } from '../context/ToastContext';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const { success } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    success('Cảm ơn bạn đã đăng ký nhận bản tin độc quyền từ CM.');
    setEmail('');
  };

  return (
    <footer id="main-footer" className="bg-white text-[#1A1A1A] border-t border-[#E5E5E1]">
      {/* 1. Geometric Horizontal Pillar Bar */}
      <div className="border-b border-[#E5E5E1] bg-[#F9F9F7] py-4 px-4 sm:px-8 lg:px-10">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-[10px] tracking-[0.2em] uppercase font-bold text-neutral-500">
          <div className="flex flex-wrap items-center gap-6 sm:gap-10">
            <div className="flex items-center space-x-2.5">
              <span className="w-1.5 h-1.5 bg-[#1A1A1A] rounded-full"></span>
              <span className="text-[#1A1A1A]">Sản phẩm tuyển chọn</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <span className="w-1.5 h-1.5 bg-[#1A1A1A] rounded-full"></span>
              <span className="text-[#1A1A1A]">Giá cả minh bạch</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <span className="w-1.5 h-1.5 bg-[#1A1A1A] rounded-full"></span>
              <span className="text-[#1A1A1A]">Giao hàng toàn quốc</span>
            </div>
          </div>
          <div className="flex space-x-6 text-[#1A1A1A] font-bold">
            <span className="hover:opacity-60 cursor-pointer">Instagram</span>
            <span className="hover:opacity-60 cursor-pointer">Facebook</span>
            <span className="hover:opacity-60 cursor-pointer">YouTube</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 pt-16 pb-12">
        {/* Top Newsletter & Brand Quote */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-14 border-b border-[#E5E5E1]">
          <div className="lg:col-span-5 space-y-4">
            <Logo variant="dark" size="lg" />
            <p className="text-xs sm:text-sm text-neutral-500 font-light leading-relaxed max-w-md pt-2">
              Khám phá không gian mua sắm thời trang và phong cách sống đương đại. Mỗi sản phẩm mang thương hiệu CM là sự đúc kết giữa chủ nghĩa tối giản và chất lượng hoàn hảo.
            </p>
            <p className="font-serif text-base sm:text-lg italic text-[#1A1A1A]">
              "Chất lượng tốt. Giá trị xứng đáng."
            </p>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="bg-[#F9F9F7] p-6 sm:p-8 border border-[#E5E5E1]">
              <span className="text-[10px] tracking-[0.3em] font-bold uppercase text-neutral-400 block mb-1">
                Bản Tin CM
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-[#1A1A1A] font-bold tracking-tight">
                Đăng ký nhận thông tin độc quyền
              </h3>
              <p className="text-xs text-neutral-500 mt-1 mb-5">
                Nhận thông báo các bộ sưu tập mới, sự kiện thành viên và ưu đãi đặc quyền.
              </p>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập địa chỉ email của bạn..."
                  required
                  className="flex-1 bg-white border border-[#E5E5E1] px-4 py-3 text-xs sm:text-sm text-[#1A1A1A] placeholder-neutral-400 focus:outline-none focus:border-[#1A1A1A] transition-colors"
                />
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-[#1A1A1A] text-white hover:bg-neutral-800 text-[11px] font-semibold tracking-[0.2em] uppercase transition-colors shrink-0 cursor-pointer"
                >
                  Đăng ký
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* 4 Main Footer Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-[#E5E5E1] text-xs">
          {/* Col 1: Shop */}
          <div>
            <h4 className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#1A1A1A] mb-4">
              Danh mục
            </h4>
            <ul className="space-y-2.5 text-neutral-500 font-medium">
              <li>
                <button onClick={() => onNavigate('/category/thoi-trang')} className="hover:text-[#1A1A1A] transition-colors cursor-pointer">
                  Thời trang Nam & Nữ
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/category/giay')} className="hover:text-[#1A1A1A] transition-colors cursor-pointer">
                  Giày Da Nappa
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/category/dong-ho')} className="hover:text-[#1A1A1A] transition-colors cursor-pointer">
                  Đồng hồ Cổ điển
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/category/tui-vi')} className="hover:text-[#1A1A1A] transition-colors cursor-pointer">
                  Túi da & Balo
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/category/cong-nghe')} className="hover:text-[#1A1A1A] transition-colors cursor-pointer">
                  Âm thanh & Công nghệ
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/category/phu-kien')} className="hover:text-[#1A1A1A] transition-colors cursor-pointer">
                  Trang sức & Kính mát
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2: About CM */}
          <div>
            <h4 className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#1A1A1A] mb-4">
              Về CM
            </h4>
            <ul className="space-y-2.5 text-neutral-500 font-medium">
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-[#1A1A1A] transition-colors cursor-pointer">
                  Câu chuyện thương hiệu
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/lookbook')} className="hover:text-[#1A1A1A] transition-colors cursor-pointer">
                  Bộ sưu tập Lookbook
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-[#1A1A1A] transition-colors cursor-pointer">
                  Quy trình chế tác
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="hover:text-[#1A1A1A] transition-colors cursor-pointer">
                  Hệ thống Boutique
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/admin')} className="hover:text-[#1A1A1A] font-semibold transition-colors cursor-pointer">
                  Cổng Quản trị Admin
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Service */}
          <div>
            <h4 className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#1A1A1A] mb-4">
              Dịch vụ khách hàng
            </h4>
            <ul className="space-y-2.5 text-neutral-500 font-medium">
              <li>
                <button onClick={() => onNavigate('/contact')} className="hover:text-[#1A1A1A] transition-colors cursor-pointer">
                  Liên hệ & Trợ giúp
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/account')} className="hover:text-[#1A1A1A] transition-colors cursor-pointer">
                  Theo dõi đơn hàng
                </button>
              </li>
              <li className="pt-2 text-[11px] text-neutral-600 space-y-1">
                <p>Hotline 24/7: <a href="tel:0798417602" className="font-bold text-[#1A1A1A] hover:underline">0798417602</a></p>
                <p>Email: <a href="mailto:cmshop238@gmail.com" className="text-[#1A1A1A] hover:underline font-mono lowercase">cmshop238@gmail.com</a></p>
                <p>Giờ mở cửa: <span className="font-semibold text-[#1A1A1A]">24/7 (24/24)</span></p>
              </li>
            </ul>
          </div>

          {/* Col 4: Policies */}
          <div>
            <h4 className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#1A1A1A] mb-4">
              Chính sách
            </h4>
            <ul className="space-y-2.5 text-neutral-500 font-medium">
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-[#1A1A1A] transition-colors cursor-pointer">
                  Chính sách vận chuyển
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-[#1A1A1A] transition-colors cursor-pointer">
                  Chính sách đổi trả 30 ngày
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-[#1A1A1A] transition-colors cursor-pointer">
                  Bảo mật thông tin
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-[#1A1A1A] transition-colors cursor-pointer">
                  Điều khoản dịch vụ
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Social & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400">
          <p>
            &copy; {new Date().getFullYear()} CM (CM Quality Products). Tất cả quyền được bảo lưu.
          </p>

          <div className="flex items-center gap-3 text-neutral-400">
            <span>Tiền tệ: <strong className="text-[#1A1A1A]">VND (₫)</strong></span>
            <span>•</span>
            <span>Ngôn ngữ: <strong className="text-[#1A1A1A]">Tiếng Việt</strong></span>
          </div>
        </div>
      </div>
    </footer>
  );
};

