import React from 'react';
import { Sparkles, ShieldCheck, Truck, HeadphonesIcon } from 'lucide-react';

export const WhyCMSection: React.FC = () => {
  const pillars = [
    {
      icon: Sparkles,
      title: 'Sản phẩm tuyển chọn',
      description: 'Mỗi thiết kế trải qua quy trình thẩm định chất liệu khắt khe, hoàn thiện thủ công tinh xảo.',
    },
    {
      icon: ShieldCheck,
      title: 'Giá trị minh bạch',
      description: 'Chính sách giá công khai, không chi phí ẩn, cam kết đúng chuẩn mực chất lượng công bố.',
    },
    {
      icon: Truck,
      title: 'Giao hàng toàn quốc',
      description: 'Vận chuyển hỏa tốc an toàn, đóng gói hộp bảo quản sang trọng chống va đập tuyệt đối.',
    },
    {
      icon: HeadphonesIcon,
      title: 'Dịch vụ tận tâm',
      description: 'Đội ngũ chuyên viên tư vấn nhiệt tình, hỗ trợ bảo dưỡng trọn đời và đổi trả trong 30 ngày.',
    },
  ];

  return (
    <section id="why-cm-section" className="py-20 sm:py-24 bg-[#F9F9F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-neutral-400 block mb-2">
            Tiêu Chuẩn Thương Hiệu
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#1A1A1A]">
            Tại sao lựa chọn CM
          </h2>
          <div className="w-10 h-[2px] bg-[#1A1A1A] mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center text-center p-8 bg-white border border-[#E5E5E1] hover:border-[#1A1A1A] transition-colors"
              >
                <div className="w-12 h-12 rounded-none bg-[#F9F9F7] border border-[#E5E5E1] flex items-center justify-center mb-5 text-[#1A1A1A]">
                  <Icon className="w-5 h-5 stroke-[1.5]" />
                </div>
                <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-[#1A1A1A] mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed font-light">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

