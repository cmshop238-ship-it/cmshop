import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, ShieldCheck } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const ContactPage: React.FC = () => {
  const { success, error } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      error('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      success('Cảm ơn bạn đã liên hệ với CM. Chuyên viên chăm sóc khách hàng sẽ phản hồi trong vòng 2 giờ.');
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="pt-24 sm:pt-28 pb-20 bg-[#FAFAFA] min-h-screen text-[#111111]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-sans-clean font-semibold tracking-[0.25em] uppercase text-neutral-400 block mb-2">
            Hỗ Trợ Khách Hàng
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-5xl font-medium text-neutral-900">
            Liên hệ với CM
          </h1>
          <p className="text-xs text-neutral-500 font-sans-clean mt-2">
            Chúng tôi luôn sẵn sàng lắng nghe mọi ý kiến đóng góp và hỗ trợ quý khách tận tâm nhất.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Info & Flagship Boutiques (Col 5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-neutral-200 p-6 sm:p-8 space-y-6">
              <h3 className="font-serif-luxury text-xl font-medium text-neutral-900 pb-3 border-b border-neutral-100">
                Thông tin trụ sở & Hotline
              </h3>

              <div className="space-y-4 text-xs font-sans-clean">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-neutral-900 font-semibold">CM Flagship Boutique Saigon</strong>
                    <span className="text-neutral-600">
                      Số 68 Đường Đồng Khởi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-neutral-900 font-semibold">CM Boutique Hanoi</strong>
                    <span className="text-neutral-600">
                      Số 28 Phố Tràng Tiền, Quận Hoàn Kiếm, TP. Hà Nội
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-neutral-900 font-semibold">Hotline hỗ trợ 24/7</strong>
                    <span className="text-neutral-600">1900 6868 (Miễn phí cước gọi)</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-neutral-900 font-semibold">Email hỗ trợ</strong>
                    <span className="text-neutral-600">concierge@cm.luxury</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-neutral-900 font-semibold">Giờ mở cửa Boutique</strong>
                    <span className="text-neutral-600">09:00 - 21:30 (Thứ Hai - Chủ Nhật)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Message Form (Col 7) */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-neutral-200 p-6 sm:p-8">
              <h3 className="font-serif-luxury text-xl font-medium text-neutral-900 pb-3 border-b border-neutral-100 mb-6">
                Gửi tin nhắn trực tiếp
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                      Họ và tên của bạn *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      required
                      className="w-full bg-neutral-50 border border-neutral-300 px-3 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                      Địa chỉ Email *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ten@example.com"
                      required
                      className="w-full bg-neutral-50 border border-neutral-300 px-3 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0901234567"
                      className="w-full bg-neutral-50 border border-neutral-300 px-3 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                      Chủ đề cần tư vấn
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Tư vấn size, đơn hàng, bảo hành..."
                      className="w-full bg-neutral-50 border border-neutral-300 px-3 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                    Nội dung tin nhắn *
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Vui lòng để lại lời nhắn chi tiết cho CM..."
                    required
                    className="w-full bg-neutral-50 border border-neutral-300 px-3 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3.5 bg-[#111111] text-white hover:bg-black text-xs font-semibold tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Đang gửi...' : 'Gửi lời nhắn'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
