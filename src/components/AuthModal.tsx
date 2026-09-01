import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User as UserIcon, Phone, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalTab, openAuthModal, login, register } = useAuth();
  const { success, error } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (authModalTab === 'login') {
      if (!email) {
        error('Vui lòng nhập email đăng nhập');
        setIsLoading(false);
        return;
      }
      await login(email);
    } else if (authModalTab === 'register') {
      if (!email || !fullName || !phoneNumber) {
        error('Vui lòng điền đầy đủ thông tin đăng ký');
        setIsLoading(false);
        return;
      }
      await register(email, fullName, phoneNumber);
    } else {
      // Forgot password flow
      success(`Hướng dẫn đặt lại mật khẩu đã được gửi đến email ${email}`);
      openAuthModal('login');
    }

    setIsLoading(false);
  };

  const handleDemoLogin = (type: 'customer' | 'admin') => {
    if (type === 'admin') {
      login('admin@cm.luxury');
    } else {
      login('thanhpham@example.com');
    }
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <div id="auth-modal-container" className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeAuthModal}
            className="fixed inset-0 bg-black/75 backdrop-blur-xs"
          />

          <div className="min-h-screen px-4 text-center flex items-center justify-center py-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md bg-[#FAFAFA] text-[#111111] shadow-2xl z-10 text-left border border-neutral-200 overflow-hidden relative p-6 sm:p-8"
            >
              {/* Close Button */}
              <button
                onClick={closeAuthModal}
                className="absolute top-5 right-5 p-1.5 text-neutral-400 hover:text-black transition-colors cursor-pointer"
                aria-label="Đóng cửa sổ"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Brand Title */}
              <div className="text-center mb-6">
                <span className="font-serif-luxury text-2xl tracking-[0.25em] uppercase text-[#111111] block mb-1">
                  CM
                </span>
                <h2 className="font-serif-luxury text-xl font-medium text-neutral-900">
                  {authModalTab === 'login' && 'Đăng nhập tài khoản'}
                  {authModalTab === 'register' && 'Tạo tài khoản thành viên'}
                  {authModalTab === 'forgot' && 'Khôi phục mật khẩu'}
                </h2>
                <p className="text-xs text-neutral-500 font-sans-clean mt-1">
                  {authModalTab === 'login' && 'Chào mừng bạn trở lại với không gian mua sắm CM.'}
                  {authModalTab === 'register' && 'Đăng ký để nhận đặc quyền thành viên và theo dõi đơn hàng.'}
                  {authModalTab === 'forgot' && 'Nhập email để nhận liên kết đặt lại mật khẩu bảo mật.'}
                </p>
              </div>

              {/* Tabs Switcher */}
              <div className="flex border-b border-neutral-200 mb-6 text-xs">
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className={`flex-1 py-2.5 font-semibold uppercase tracking-wider text-center transition-colors cursor-pointer ${
                    authModalTab === 'login'
                      ? 'border-b-2 border-black text-black'
                      : 'text-neutral-400 hover:text-neutral-700'
                  }`}
                >
                  Đăng nhập
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal('register')}
                  className={`flex-1 py-2.5 font-semibold uppercase tracking-wider text-center transition-colors cursor-pointer ${
                    authModalTab === 'register'
                      ? 'border-b-2 border-black text-black'
                      : 'text-neutral-400 hover:text-neutral-700'
                  }`}
                >
                  Đăng ký
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {authModalTab === 'register' && (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                      Họ và tên
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Ví dụ: Nguyễn Văn A"
                        required
                        className="w-full bg-white border border-neutral-300 pl-9 pr-3 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                    Địa chỉ Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ten@example.com"
                      required
                      className="w-full bg-white border border-neutral-300 pl-9 pr-3 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                {authModalTab === 'register' && (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                      Số điện thoại
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="0901234567"
                        required
                        className="w-full bg-white border border-neutral-300 pl-9 pr-3 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>
                )}

                {authModalTab !== 'forgot' && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700">
                        Mật khẩu
                      </label>
                      {authModalTab === 'login' && (
                        <button
                          type="button"
                          onClick={() => openAuthModal('forgot')}
                          className="text-[11px] text-neutral-500 hover:text-black cursor-pointer"
                        >
                          Quên mật khẩu?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full bg-white border border-neutral-300 pl-9 pr-3 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-[#111111] text-white hover:bg-black text-xs font-semibold tracking-widest uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span>
                    {isLoading
                      ? 'Đang xử lý...'
                      : authModalTab === 'login'
                      ? 'Đăng nhập'
                      : authModalTab === 'register'
                      ? 'Tạo tài khoản'
                      : 'Gửi mã khôi phục'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* 1-Click Quick Demo Sign In Helpers */}
              <div className="mt-6 pt-5 border-t border-neutral-200">
                <p className="text-[11px] uppercase tracking-wider text-neutral-400 text-center mb-3">
                  Đăng nhập nhanh tiện lợi để trải nghiệm
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('customer')}
                    className="px-3 py-2 bg-white border border-neutral-300 hover:border-black text-[11px] font-medium text-neutral-800 transition-colors text-center cursor-pointer"
                  >
                    👤 Khách hàng Demo
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('admin')}
                    className="px-3 py-2 bg-neutral-900 hover:bg-black text-[11px] font-medium text-white transition-colors text-center cursor-pointer border border-neutral-800"
                  >
                    👑 Quản trị viên (Admin)
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-neutral-600 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-600" />
                <span>Bảo mật thông tin người dùng theo tiêu chuẩn quốc tế</span>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
