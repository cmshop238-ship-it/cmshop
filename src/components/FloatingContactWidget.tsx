import React, { useState } from 'react';
import { Phone, MessageCircle, Mail, Clock, X, ChevronUp, Sparkles, ShieldCheck } from 'lucide-react';

interface FloatingContactWidgetProps {
  onNavigate?: (path: string) => void;
}

export const FloatingContactWidget: React.FC<FloatingContactWidgetProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside aria-label="Hỗ trợ khách hàng 24/7" className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Expanded Quick Contact Panel */}
      {isOpen && (
        <div 
          className="mb-3 w-80 bg-white/95 backdrop-blur-md border border-neutral-200 shadow-2xl p-5 text-neutral-900 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
          style={{ borderRadius: '14px' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <div>
                <h4 className="text-xs font-serif-luxury font-bold uppercase tracking-wider text-neutral-900">
                  CMSHOP Concierge 24/7
                </h4>
                <p className="text-[10px] text-neutral-500 font-sans-clean flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-600 inline" /> Trực tuyến 24/24 sẵn sàng hỗ trợ
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Action List */}
          <div className="mt-3.5 space-y-2">
            {/* Call Hotline */}
            <a
              href="tel:0798417602"
              className="flex items-center gap-3 p-2.5 rounded-lg bg-neutral-50 hover:bg-neutral-900 hover:text-white group border border-neutral-100 transition-all duration-200"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-100 group-hover:bg-emerald-900 flex items-center justify-center text-emerald-700 group-hover:text-emerald-300 shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="text-[10px] uppercase font-semibold text-neutral-400 group-hover:text-neutral-300">
                  Hotline Hỗ Trợ Nhanh
                </div>
                <div className="text-xs font-bold font-mono text-neutral-900 group-hover:text-white">
                  0798417602
                </div>
              </div>
              <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold uppercase">
                Miễn phí
              </span>
            </a>

            {/* Zalo Direct Chat */}
            <a
              href="https://zalo.me/0798417602"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2.5 rounded-lg bg-neutral-50 hover:bg-[#0068FF] hover:text-white group border border-neutral-100 transition-all duration-200"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 group-hover:bg-white flex items-center justify-center text-[#0068FF] shrink-0 font-bold text-xs">
                Zalo
              </div>
              <div className="flex-1">
                <div className="text-[10px] uppercase font-semibold text-neutral-400 group-hover:text-blue-100">
                  Tư Vấn Trực Tiếp Zalo
                </div>
                <div className="text-xs font-bold text-neutral-900 group-hover:text-white">
                  Chat với CSKH CMSHOP
                </div>
              </div>
              <MessageCircle className="w-4 h-4 text-neutral-400 group-hover:text-white" />
            </a>

            {/* Email Support */}
            <a
              href="mailto:cmshop238@gmail.com"
              className="flex items-center gap-3 p-2.5 rounded-lg bg-neutral-50 hover:bg-neutral-900 hover:text-white group border border-neutral-100 transition-all duration-200"
            >
              <div className="w-8 h-8 rounded-full bg-neutral-200 group-hover:bg-neutral-800 flex items-center justify-center text-neutral-700 group-hover:text-neutral-200 shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="text-[10px] uppercase font-semibold text-neutral-400 group-hover:text-neutral-300">
                  Gửi Email Hỗ Trợ
                </div>
                <div className="text-[11px] font-mono font-medium text-neutral-900 group-hover:text-white truncate">
                  cmshop238@gmail.com
                </div>
              </div>
            </a>
          </div>

          {/* Footer Quality Badge */}
          <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between text-[10px] text-neutral-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Cam kết chính hãng 100%
            </span>
            <span className="font-semibold text-neutral-700">CMSHOP LUXURY</span>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 px-4 py-3 bg-[#111111] hover:bg-black text-white rounded-full shadow-xl hover:shadow-2xl border border-neutral-800 transition-all duration-300 cursor-pointer active:scale-95"
      >
        <div className="relative">
          <Phone className="w-4 h-4 text-amber-400" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full" />
        </div>
        <div className="text-left leading-none pr-1">
          <span className="text-[9px] block uppercase tracking-wider text-neutral-400 font-semibold">
            Hỗ trợ 24/7
          </span>
          <span className="text-xs font-mono font-bold text-white tracking-wide">
            0798417602
          </span>
        </div>
      </button>
    </aside>
  );
};
