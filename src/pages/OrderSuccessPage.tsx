import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Package,
  QrCode,
  ArrowRight,
  Copy,
  Printer,
  ShieldCheck,
  Check,
  Building,
  CreditCard
} from 'lucide-react';
import { orderService } from '../services/orderService';
import { useToast } from '../context/ToastContext';
import { Order } from '../types';
import { formatVND, formatDate } from '../utils/format';

interface OrderSuccessPageProps {
  orderId: string;
  onNavigate: (path: string) => void;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ orderId, onNavigate }) => {
  const { success, error } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSimulatingPayment, setIsSimulatingPayment] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (orderId) {
      setLoading(true);
      orderService
        .getOrderById(orderId)
        .then((found) => {
          if (isMounted) {
            setOrder(found);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.error(err);
          if (isMounted) {
            setLoading(false);
          }
        });
    } else {
      setLoading(false);
    }
    return () => {
      isMounted = false;
    };
  }, [orderId]);

  if (loading) {
    return (
      <div className="pt-32 pb-24 text-center min-h-[60vh] flex flex-col items-center justify-center bg-[#FAFAFA] text-[#111111]">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-neutral-500 font-sans-clean">Đang nạp thông tin đơn hàng...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="pt-32 pb-24 text-center min-h-[60vh] flex flex-col items-center justify-center bg-[#FAFAFA] text-[#111111]">
        <h2 className="font-serif-luxury text-2xl font-medium mb-3">
          Không tìm thấy thông tin đơn hàng
        </h2>
        <p className="text-xs text-neutral-500 mb-6 font-sans-clean">
          Mã đơn hàng không tồn tại hoặc đã bị xóa.
        </p>
        <button
          onClick={() => onNavigate('/')}
          className="px-6 py-2.5 bg-black text-white text-xs font-semibold uppercase tracking-widest cursor-pointer hover:bg-neutral-800"
        >
          Về trang chủ
        </button>
      </div>
    );
  }

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    success(`Đã sao chép ${fieldName} vào bộ nhớ tạm.`);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleSimulatePaymentConfirmation = async () => {
    setIsSimulatingPayment(true);
    try {
      const updated = await orderService.updatePaymentStatus(order.id, 'paid');
      if (updated) {
        setOrder(updated);
        success('Hệ thống đã tự động nhận diện thanh toán thành công!');
      }
    } catch (err: any) {
      error(err.message || 'Không thể cập nhật trạng thái.');
    } finally {
      setIsSimulatingPayment(false);
    }
  };

  // VietQR parameters
  const bankCode = 'MB'; // MB Bank
  const accountNumber = '0988888888';
  const accountHolder = 'CM LUXURY VIETNAM';
  const transferContent = `CM ${order.id}`;
  const qrUrl = `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact.png?amount=${order.totalAmount}&addInfo=${encodeURIComponent(
    transferContent
  )}&accountName=${encodeURIComponent(accountHolder)}`;

  const isBankTransfer = order.paymentMethod === 'bank_transfer';
  const isPaid = order.paymentStatus === 'paid';

  return (
    <div className="pt-24 sm:pt-28 pb-20 bg-[#FAFAFA] min-h-screen text-[#111111]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Banner */}
        <div className="bg-white border border-neutral-200 p-8 text-center mb-8 shadow-sm">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>

          <span className="text-[11px] font-sans-clean font-semibold tracking-[0.25em] uppercase text-neutral-400 block mb-1">
            Đặt Hàng Thành Công
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-medium text-neutral-900 mb-2">
            Cảm ơn quý khách đã tin chọn CM
          </h1>
          <p className="text-xs text-neutral-600 font-sans-clean max-w-md mx-auto">
            Mã đơn hàng: <strong className="font-mono text-black font-bold">#{order.id}</strong>. Thông tin xác nhận và hóa đơn chi tiết đã được gửi tới email <strong className="text-black">{order.customer.email}</strong>.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 border border-neutral-300 hover:border-black text-xs font-semibold uppercase tracking-wider text-neutral-700 hover:text-black flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In đơn hàng</span>
            </button>
            <button
              onClick={() => onNavigate('/products')}
              className="px-6 py-2 bg-[#111111] hover:bg-black text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        </div>

        {/* VietQR Direct Bank Payment Block (If Bank Transfer chosen) */}
        {isBankTransfer && (
          <div className="bg-white border border-neutral-200 p-6 sm:p-8 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-100 gap-2 mb-6">
              <div>
                <h2 className="font-serif-luxury text-xl font-medium text-neutral-900 flex items-center gap-2">
                  <QrCode className="w-5 h-5" />
                  <span>Chuyển khoản VietQR tự động</span>
                </h2>
                <p className="text-xs text-neutral-500 font-sans-clean mt-0.5">
                  Mở ứng dụng ngân hàng và quét mã QR bên dưới để thanh toán tức thì.
                </p>
              </div>

              <div>
                {isPaid ? (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1 border border-emerald-200">
                    <Check className="w-3.5 h-3.5" />
                    <span>Đã thanh toán</span>
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1 border border-amber-200 animate-pulse">
                    <span>Chờ chuyển khoản</span>
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* QR Image */}
              <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-neutral-50 border border-neutral-200">
                <img
                  src={qrUrl}
                  alt="VietQR Payment"
                  className="w-56 h-auto object-contain bg-white p-2 border border-neutral-200 shadow-xs"
                />
                <span className="text-[10px] text-neutral-600 uppercase tracking-wider font-semibold mt-3 text-center">
                  VietQR 24/7 Napas
                </span>
              </div>

              {/* Transfer Specs */}
              <div className="md:col-span-7 space-y-3 text-xs font-sans-clean">
                <div className="flex justify-between items-center p-2.5 bg-neutral-50 border border-neutral-200">
                  <span className="text-neutral-500">Ngân hàng thụ hưởng:</span>
                  <span className="font-bold text-neutral-900">MB Bank (Quân Đội)</span>
                </div>

                <div className="flex justify-between items-center p-2.5 bg-neutral-50 border border-neutral-200">
                  <span className="text-neutral-500">Chủ tài khoản:</span>
                  <span className="font-bold text-neutral-900 uppercase">{accountHolder}</span>
                </div>

                <div className="flex justify-between items-center p-2.5 bg-neutral-50 border border-neutral-200">
                  <div>
                    <span className="text-neutral-500 block text-[11px]">Số tài khoản:</span>
                    <span className="font-mono font-bold text-sm text-neutral-900">{accountNumber}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(accountNumber, 'Số tài khoản')}
                    className="p-1.5 hover:bg-neutral-200 rounded text-neutral-700 cursor-pointer"
                    title="Sao chép"
                  >
                    {copiedField === 'Số tài khoản' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex justify-between items-center p-2.5 bg-neutral-50 border border-neutral-200">
                  <div>
                    <span className="text-neutral-500 block text-[11px]">Số tiền cần chuyển:</span>
                    <span className="font-bold text-sm text-black">{formatVND(order.totalAmount)}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(order.totalAmount.toString(), 'Số tiền')}
                    className="p-1.5 hover:bg-neutral-200 rounded text-neutral-700 cursor-pointer"
                    title="Sao chép"
                  >
                    {copiedField === 'Số tiền' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex justify-between items-center p-2.5 bg-neutral-50 border border-neutral-200">
                  <div>
                    <span className="text-neutral-500 block text-[11px]">Nội dung chuyển khoản:</span>
                    <span className="font-mono font-bold text-sm text-black">{transferContent}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(transferContent, 'Nội dung chuyển khoản')}
                    className="p-1.5 hover:bg-neutral-200 rounded text-neutral-700 cursor-pointer"
                    title="Sao chép"
                  >
                    {copiedField === 'Nội dung chuyển khoản' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {!isPaid && (
                  <button
                    onClick={handleSimulatePaymentConfirmation}
                    disabled={isSimulatingPayment}
                    className="w-full py-2.5 mt-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isSimulatingPayment ? 'Đang kiểm tra giao dịch...' : 'Tôi đã hoàn tất chuyển khoản'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Order Details & Summary Card */}
        <div className="bg-white border border-neutral-200 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 gap-2">
            <div>
              <span className="text-[11px] text-neutral-400 font-sans-clean uppercase tracking-wider block">
                Ngày đặt hàng: {formatDate(order.createdAt)}
              </span>
              <h3 className="font-serif-luxury text-xl font-medium text-neutral-900">
                Chi tiết kiện hàng #{order.id}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-neutral-500 block">Mã vận đơn:</span>
              <span className="font-mono font-bold text-xs text-neutral-900">{order.trackingNumber}</span>
            </div>
          </div>

          {/* Customer & Shipping Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans-clean pb-6 border-b border-neutral-200">
            <div>
              <h4 className="font-semibold uppercase tracking-wider text-neutral-900 mb-2">
                Địa chỉ nhận hàng
              </h4>
              <p className="text-neutral-800 font-medium">{order.customer.fullName}</p>
              <p className="text-neutral-600">{order.customer.phoneNumber}</p>
              <p className="text-neutral-600">
                {order.customer.streetAddress}, {order.customer.ward}, {order.customer.district}, {order.customer.province}
              </p>
            </div>

            <div>
              <h4 className="font-semibold uppercase tracking-wider text-neutral-900 mb-2">
                Hình thức giao & Thanh toán
              </h4>
              <p className="text-neutral-600">
                Vận chuyển:{' '}
                <strong className="text-neutral-900">
                  {order.shippingMethod === 'express' ? 'Hỏa tốc (2H - 4H)' : 'Tiêu chuẩn (2 - 4 ngày)'}
                </strong>
              </p>
              <p className="text-neutral-600">
                Thanh toán:{' '}
                <strong className="text-neutral-900 uppercase">{order.paymentMethod}</strong>
              </p>
              <p className="text-neutral-600">
                Trạng thái thanh toán:{' '}
                <strong className={isPaid ? 'text-emerald-700' : 'text-amber-700'}>
                  {order.paymentStatus === 'paid' ? 'ĐÃ THANH TOÁN' : 'CHƯA THANH TOÁN'}
                </strong>
              </p>
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="divide-y divide-neutral-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-12 h-14 object-cover bg-neutral-100 border border-neutral-200"
                  />
                  <div>
                    <h5 className="text-xs font-semibold text-neutral-900">{item.productName}</h5>
                    <div className="text-[11px] text-neutral-500 font-mono">
                      {item.selectedVariantText || `SKU: ${item.sku}`}
                    </div>
                    <span className="text-[11px] text-neutral-600">Số lượng: {item.quantity}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-neutral-900">{formatVND(item.subtotal)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Order Financials */}
          <div className="pt-4 border-t border-neutral-200 space-y-2 text-xs font-sans-clean">
            <div className="flex justify-between text-neutral-600">
              <span>Tạm tính</span>
              <span>{formatVND(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Phí vận chuyển</span>
              <span>{order.shippingFee === 0 ? 'Miễn phí' : formatVND(order.shippingFee)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Giảm giá ({order.appliedCoupon})</span>
                <span>-{formatVND(order.discountAmount)}</span>
              </div>
            )}
            <div className="pt-3 border-t border-neutral-200 flex justify-between items-baseline">
              <span className="text-sm font-bold text-neutral-900">Tổng thanh toán</span>
              <span className="text-xl font-bold text-[#111111]">{formatVND(order.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
