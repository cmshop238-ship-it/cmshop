import React from 'react';
import { ShieldCheck, Award, Sparkles, HeartHandshake } from 'lucide-react';
import { WhyCMSection } from '../components/WhyCMSection';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="pt-24 sm:pt-28 pb-20 bg-[#FAFAFA] min-h-screen text-[#111111]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Story Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[11px] font-sans-clean font-semibold tracking-[0.3em] uppercase text-neutral-400 block mb-3">
            Câu Chuyện Thương Hiệu
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-6xl font-normal text-neutral-900 leading-tight">
            Khát vọng định hình
            <br />
            <span className="italic font-light">sự sang trọng tối giản.</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 font-sans-clean mt-4 leading-relaxed font-light">
            CM được thành lập dựa trên một niềm tin vững chắc: Giá trị thực sự của một món đồ không nằm ở logo hào nhoáng, mà ở cảm xúc chân thực khi bạn chạm vào chất liệu thượng hạng và từng đường kim mũi chỉ hoàn mỹ.
          </p>
        </div>

        {/* Hero Visual Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-20">
          <div className="md:col-span-7 aspect-[4/3] bg-neutral-900 overflow-hidden border border-neutral-200">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop"
              alt="CM Workshop"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="md:col-span-5 flex flex-col justify-center space-y-6 p-6 sm:p-8 bg-white border border-neutral-200">
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
              Triết lý cốt lõi
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-medium text-neutral-900 leading-snug">
              "Chất lượng tốt. Giá trị xứng đáng."
            </h2>
            <p className="text-xs text-neutral-600 font-sans-clean leading-relaxed">
              Mỗi sản phẩm CM được tuyển chọn khắt khe từ các nghệ nhân lành nghề và những xưởng gia công uy tín trên toàn thế giới. Chúng tôi kết hợp ngôn ngữ thiết kế đương đại của kiến trúc Bắc Âu với sự tỉ mỉ của kỹ thuật chế tác thủ công truyền thống.
            </p>
          </div>
        </div>

        {/* 3 Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white border border-neutral-200 p-8">
            <span className="font-serif-luxury text-3xl text-neutral-300 block mb-4">01</span>
            <h3 className="font-serif-luxury text-xl font-medium text-neutral-900 mb-2">
              Chất liệu nguyên bản
            </h3>
            <p className="text-xs text-neutral-600 font-sans-clean leading-relaxed">
              Da bò Nappa nhập khẩu từ Ý, bạc Sterling 925 chống xỉn màu và sợi cotton tự nhiên 100% thoáng khí đem lại cảm giác thoải mái tối ưu.
            </p>
          </div>

          <div className="bg-white border border-neutral-200 p-8">
            <span className="font-serif-luxury text-3xl text-neutral-300 block mb-4">02</span>
            <h3 className="font-serif-luxury text-xl font-medium text-neutral-900 mb-2">
              Thẩm mỹ phi thời gian
            </h3>
            <p className="text-xs text-neutral-600 font-sans-clean leading-relaxed">
              Những đường cắt may dứt khoát, gam màu trung tính tinh tế giúp sản phẩm không bao giờ lỗi mốt sau nhiều năm sử dụng.
            </p>
          </div>

          <div className="bg-white border border-neutral-200 p-8">
            <span className="font-serif-luxury text-3xl text-neutral-300 block mb-4">03</span>
            <h3 className="font-serif-luxury text-xl font-medium text-neutral-900 mb-2">
              Trải nghiệm xứng tầm
            </h3>
            <p className="text-xs text-neutral-600 font-sans-clean leading-relaxed">
              Đóng gói tinh tế với hộp cứng signature, dịch vụ chăm sóc khách hàng 24/7 và chính sách bảo hành, đổi trả minh bạch trong 30 ngày.
            </p>
          </div>
        </div>

        {/* Trust Section */}
        <WhyCMSection />
      </div>
    </div>
  );
};
