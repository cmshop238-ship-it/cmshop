import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  QrCode,
  Wallet,
  ArrowRight,
  ChevronLeft,
  Lock,
  Building2
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { orderService } from '../services/orderService';
import { PaymentMethod, ShippingMethod } from '../types';
import { formatVND } from '../utils/format';

interface CheckoutPageProps {
  onNavigate: (path: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const {
    items,
    subtotal,
    discountAmount,
    appliedCoupon,
    clearCart,
  } = useCart();
  const { user } = useAuth();
  const { error, success } = useToast();

  // Form State
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phoneNumber || '');
  const [email, setEmail] = useState(user?.email || '');
  const [province, setProvince] = useState(user?.addresses?.[0]?.province || 'TP. Hồ Chí Minh');
  const [district, setDistrict] = useState(user?.addresses?.[0]?.district || 'Quận 1');
  const [ward, setWard] = useState(user?.addresses?.[0]?.ward || 'Phường Bến Nghé');
  const [streetAddress, setStreetAddress] = useState(user?.addresses?.[0]?.streetAddress || '');
  const [orderNote, setOrderNote] = useState('');

  // Shipping & Payment Method
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('standard');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bank_transfer');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic shipping fee calculation
  const calculatedShippingFee =
    shippingMethod === 'express'
      ? 50000
      : subtotal >= 2000000
      ? 0
      : 30000;

  const finalTotal = Math.max(0, subtotal - discountAmount + calculatedShippingFee);

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-24 text-center min-h-[65vh] flex flex-col items-center justify-center bg-[#FAFAFA] text-[#111111]">
        <h2 className="font-serif-luxury text-2xl sm:text-3xl font-medium mb-3">
          Giỏ hàng của bạn đang trống
        </h2>
        <p className="text-xs text-neutral-500 font-sans-clean max-w-sm mb-6">
          Vui lòng chọn thêm sản phẩm vào giỏ hàng trước khi tiến hành thanh toán.
        </p>
        <button
          onClick={() => onNavigate('/products')}
          className="px-8 py-3 bg-[#111111] text-white text-xs font-semibold tracking-widest uppercase hover:bg-black transition-colors cursor-pointer"
        >
          Khám phá sản phẩm
        </button>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!fullName.trim()) {
      error('Vui lòng nhập họ và tên người nhận.');
      return;
    }
    if (!phone.trim() || phone.length < 9) {
      error('Vui lòng nhập số điện thoại hợp lệ (ít nhất 9 số).');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      error('Vui lòng nhập địa chỉ email hợp lệ.');
      return;
    }
    if (!streetAddress.trim()) {
      error('Vui lòng nhập địa chỉ cụ thể (số nhà, tên đường).');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create order with backend-like price verification
      const newOrder = await orderService.createOrder({
        customer: {
          fullName: fullName.trim(),
          phoneNumber: phone.trim(),
          email: email.trim(),
          province,
          district,
          ward,
          streetAddress: streetAddress.trim(),
          note: orderNote.trim(),
        },
        shippingMethod,
        paymentMethod,
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
          selectedVariantText: [i.selectedColor, i.selectedSize].filter(Boolean).join(' / '),
        })),
        couponCode: appliedCoupon?.code,
      });

      // 2. Clear Cart
      clearCart();
      success('Đặt hàng thành công!');

      // 3. Route to Order Confirmation
      onNavigate(`/order-success/${newOrder.id}`);
    } catch (err: any) {
      error(err.message || 'Đã có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 sm:pt-28 pb-20 bg-[#FAFAFA] min-h-screen text-[#111111]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <button
            onClick={() => onNavigate('/products')}
            className="text-xs text-neutral-500 hover:text-black flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Tiếp tục mua hàng</span>
          </button>
        </div>

        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] font-sans-clean font-semibold tracking-[0.25em] uppercase text-neutral-400 block mb-2">
            Thanh Toán Đơn Hàng
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-medium text-neutral-900 tracking-wide">
            Xác nhận & Thanh toán
          </h1>
        </div>

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left: Shipping & Payment Information (Col 7) */}
            <div className="lg:col-span-7 space-y-8">
              {/* 1. Customer Details */}
              <div className="bg-white border border-neutral-200 p-6 sm:p-8">
                <h3 className="font-serif-luxury text-xl font-medium text-neutral-900 mb-4 pb-3 border-b border-neutral-100 flex items-center justify-between">
                  <span>1. Thông tin người nhận</span>
                  <span className="text-xs text-neutral-400 font-sans-clean font-normal">
                    {user ? `Đang đăng nhập: ${user.fullName}` : 'Khách vãng lai'}
                  </span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      required
                      className="w-full bg-neutral-50 border border-neutral-300 px-3 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0901234567"
                      required
                      className="w-full bg-neutral-50 border border-neutral-300 px-3 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                      Địa chỉ Email nhận hóa đơn *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nguyenvana@example.com"
                      required
                      className="w-full bg-neutral-50 border border-neutral-300 px-3 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                      Tỉnh / Thành phố *
                    </label>
                    <select
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-300 px-3 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
                    >
                      <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                      <option value="Hà Nội">Hà Nội</option>
                      <option value="Đà Nẵng">Đà Nẵng</option>
                      <option value="Hải Phòng">Hải Phòng</option>
                      <option value="Cần Thơ">Cần Thơ</option>
                      <option value="Khác">Tỉnh / Thành khác</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                      Quận / Huyện *
                    </label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="Quận 1, Ba Đình, Hải Châu..."
                      required
                      className="w-full bg-neutral-50 border border-neutral-300 px-3 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                      Phường / Xã *
                    </label>
                    <input
                      type="text"
                      value={ward}
                      onChange={(e) => setWard(e.target.value)}
                      placeholder="Phường Bến Nghé, Tràng Tiền..."
                      required
                      className="w-full bg-neutral-50 border border-neutral-300 px-3 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                      Địa chỉ cụ thể *
                    </label>
                    <input
                      type="text"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder="Số nhà, Tên tòa nhà, Tên đường..."
                      required
                      className="w-full bg-neutral-50 border border-neutral-300 px-3 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                      Ghi chú đơn hàng (Tùy chọn)
                    </label>
                    <textarea
                      rows={2}
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                      placeholder="Ví dụ: Giao giờ hành chính, gọi điện trước khi giao..."
                      className="w-full bg-neutral-50 border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-black"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Shipping Method */}
              <div className="bg-white border border-neutral-200 p-6 sm:p-8">
                <h3 className="font-serif-luxury text-xl font-medium text-neutral-900 mb-4 pb-3 border-b border-neutral-100 flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  <span>2. Phương thức vận chuyển</span>
                </h3>

                <div className="space-y-3">
                  {/* Standard */}
                  <label
                    onClick={() => setShippingMethod('standard')}
                    className={`flex items-center justify-between p-4 border cursor-pointer transition-all ${
                      shippingMethod === 'standard'
                        ? 'border-black bg-neutral-50 ring-1 ring-black'
                        : 'border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shippingMethod"
                        checked={shippingMethod === 'standard'}
                        onChange={() => setShippingMethod('standard')}
                        className="accent-black"
                      />
                      <div>
                        <div className="font-semibold text-xs text-neutral-900">
                          Giao hàng tiêu chuẩn (2 - 4 ngày làm việc)
                        </div>
                        <div className="text-[11px] text-neutral-500 font-sans-clean">
                          Miễn phí cho tất cả đơn hàng từ 2.000.000₫
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-neutral-900">
                      {subtotal >= 2000000 ? (
                        <span className="text-emerald-600 font-bold uppercase">Miễn phí</span>
                      ) : (
                        formatVND(30000)
                      )}
                    </span>
                  </label>

                  {/* Express */}
                  <label
                    onClick={() => setShippingMethod('express')}
                    className={`flex items-center justify-between p-4 border cursor-pointer transition-all ${
                      shippingMethod === 'express'
                        ? 'border-black bg-neutral-50 ring-1 ring-black'
                        : 'border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shippingMethod"
                        checked={shippingMethod === 'express'}
                        onChange={() => setShippingMethod('express')}
                        className="accent-black"
                      />
                      <div>
                        <div className="font-semibold text-xs text-neutral-900">
                          Giao hàng hỏa tốc 2H - 4H (Nội thành)
                        </div>
                        <div className="text-[11px] text-neutral-500 font-sans-clean">
                          Ưu tiên giao gấp trong khung giờ hành chính
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-neutral-900">{formatVND(50000)}</span>
                  </label>
                </div>
              </div>

              {/* 3. Payment Method */}
              <div className="bg-white border border-neutral-200 p-6 sm:p-8">
                <h3 className="font-serif-luxury text-xl font-medium text-neutral-900 mb-4 pb-3 border-b border-neutral-100 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  <span>3. Phương thức thanh toán</span>
                </h3>

                <div className="space-y-3">
                  {/* VietQR Bank Transfer (Recommended) */}
                  <label
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`flex items-start gap-3 p-4 border cursor-pointer transition-all ${
                      paymentMethod === 'bank_transfer'
                        ? 'border-black bg-neutral-50 ring-1 ring-black'
                        : 'border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={() => setPaymentMethod('bank_transfer')}
                      className="accent-black mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-xs text-neutral-900 flex items-center gap-1.5">
                          <QrCode className="w-4 h-4 text-neutral-900" />
                          <span>Chuyển khoản VietQR (Khuyên dùng)</span>
                        </div>
                        <span className="text-[10px] uppercase font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5">
                          Tự động khớp lệnh 24/7
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 font-sans-clean mt-1">
                        Quét mã VietQR nhanh chóng qua ứng dụng MB Bank hoặc mọi ngân hàng (VCB, Techcombank, ACB...).
                      </p>
                      {paymentMethod === 'bank_transfer' && (
                        <div className="mt-3 p-3 bg-white border border-neutral-200 text-[11px] font-sans-clean text-neutral-700 space-y-1">
                          <div className="flex justify-between">
                            <span className="text-neutral-500">Ngân hàng:</span>
                            <span className="font-semibold text-neutral-900">MB Bank (Quân Đội)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-500">Số tài khoản:</span>
                            <span className="font-mono font-bold text-neutral-900">0589614334</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-500">Chủ tài khoản:</span>
                            <span className="font-bold text-neutral-900 uppercase">PHAM QUANG THANH</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </label>

                  {/* COD */}
                  <label
                    onClick={() => setPaymentMethod('cod')}
                    className={`flex items-start gap-3 p-4 border cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-black bg-neutral-50 ring-1 ring-black'
                        : 'border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-black mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-xs text-neutral-900 flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-neutral-900" />
                        <span>Thanh toán khi nhận hàng (COD)</span>
                      </div>
                      <p className="text-[11px] text-neutral-500 font-sans-clean mt-1">
                        Thanh toán tiền mặt cho nhân viên giao hàng sau khi kiểm tra kiện hàng.
                      </p>
                    </div>
                  </label>

                  {/* VNPay */}
                  <label
                    onClick={() => setPaymentMethod('vnpay')}
                    className={`flex items-start gap-3 p-4 border cursor-pointer transition-all ${
                      paymentMethod === 'vnpay'
                        ? 'border-black bg-neutral-50 ring-1 ring-black'
                        : 'border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'vnpay'}
                      onChange={() => setPaymentMethod('vnpay')}
                      className="accent-black mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-xs text-neutral-900 flex items-center gap-1.5">
                        <Wallet className="w-4 h-4 text-neutral-900" />
                        <span>Cổng thanh toán VNPay</span>
                      </div>
                      <p className="text-[11px] text-neutral-500 font-sans-clean mt-1">
                        Thẻ ATM nội địa, QR Pay và tài khoản ngân hàng liên kết VNPay.
                      </p>
                    </div>
                  </label>

                  {/* MoMo */}
                  <label
                    onClick={() => setPaymentMethod('momo')}
                    className={`flex items-start gap-3 p-4 border cursor-pointer transition-all ${
                      paymentMethod === 'momo'
                        ? 'border-black bg-neutral-50 ring-1 ring-black'
                        : 'border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'momo'}
                      onChange={() => setPaymentMethod('momo')}
                      className="accent-black mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-xs text-neutral-900 flex items-center gap-1.5">
                        <Wallet className="w-4 h-4 text-rose-600" />
                        <span>Ví điện tử MoMo</span>
                      </div>
                      <p className="text-[11px] text-neutral-500 font-sans-clean mt-1">
                        Quét mã QR MoMo nhanh chóng và bảo mật.
                      </p>
                    </div>
                  </label>

                  {/* International Cards */}
                  <label
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`flex items-start gap-3 p-4 border cursor-pointer transition-all ${
                      paymentMethod === 'credit_card'
                        ? 'border-black bg-neutral-50 ring-1 ring-black'
                        : 'border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'credit_card'}
                      onChange={() => setPaymentMethod('credit_card')}
                      className="accent-black mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-xs text-neutral-900 flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-neutral-900" />
                        <span>Thẻ thanh toán quốc tế (Visa, Mastercard, JCB)</span>
                      </div>
                      <p className="text-[11px] text-neutral-500 font-sans-clean mt-1">
                        Bảo mật 3D-Secure mã hóa theo chuẩn PCI DSS cấp 1.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right: Order Summary & Placement (Col 5) */}
            <div className="lg:col-span-5">
              <div className="bg-white border border-neutral-200 p-6 sm:p-8 sticky top-28 space-y-6">
                <h3 className="font-serif-luxury text-xl font-medium text-neutral-900 pb-3 border-b border-neutral-100">
                  Tóm tắt đơn hàng ({items.length} món)
                </h3>

                {/* Items List */}
                <div className="max-h-60 overflow-y-auto divide-y divide-neutral-100 pr-1 space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="pt-3 first:pt-0 flex gap-3 items-center">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-12 h-14 object-cover bg-neutral-100 border border-neutral-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-medium text-neutral-900 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <div className="text-[11px] text-neutral-500">
                          {item.selectedColor && <span>Màu: {item.selectedColor} </span>}
                          {item.selectedSize && <span>• Size: {item.selectedSize}</span>}
                        </div>
                        <span className="text-[11px] text-neutral-700">SL: {item.quantity}</span>
                      </div>
                      <span className="text-xs font-semibold text-neutral-900">
                        {formatVND(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Pricing Calculation */}
                <div className="space-y-2.5 pt-4 border-t border-neutral-200 text-xs font-sans-clean">
                  <div className="flex justify-between text-neutral-600">
                    <span>Tạm tính</span>
                    <span className="font-medium text-neutral-900">{formatVND(subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-neutral-600">
                    <span>Phí vận chuyển</span>
                    <span>
                      {calculatedShippingFee === 0 ? (
                        <strong className="text-emerald-600 uppercase text-[11px]">Miễn phí</strong>
                      ) : (
                        formatVND(calculatedShippingFee)
                      )}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Giảm giá ({appliedCoupon?.code})</span>
                      <span className="font-semibold">-{formatVND(discountAmount)}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-neutral-200 flex justify-between items-baseline">
                    <span className="text-sm font-semibold text-neutral-900">Tổng thanh toán</span>
                    <span className="text-xl font-bold text-[#111111]">{formatVND(finalTotal)}</span>
                  </div>
                </div>

                {/* Final CTA Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#111111] text-white hover:bg-black text-xs font-semibold tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md active:scale-[0.99]"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Đang xử lý đặt hàng...' : 'Hoàn tất đặt hàng'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-600 text-center uppercase tracking-widest">
                  <ShieldCheck className="w-3.5 h-3.5 text-neutral-600" />
                  <span>Dữ liệu được bảo mật chuẩn mã hóa SSL 256-bit</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
