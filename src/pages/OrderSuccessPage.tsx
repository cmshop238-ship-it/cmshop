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
  CreditCard,
  Download,
  Clock,
  Sparkles,
  PhoneCall,
  ExternalLink,
  ChevronRight,
  RefreshCw
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
  const [countdown, setCountdown] = useState(900); // 15 mins payment window

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

  // Countdown timer for VietQR window
  useEffect(() => {
    if (order?.paymentMethod === 'bank_transfer' && order.paymentStatus !== 'paid') {
      const timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [order]);

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="pt-32 pb-24 text-center min-h-[65vh] flex flex-col items-center justify-center bg-[#FAFAFA] text-[#111111]">
        <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-neutral-500 font-sans-clean tracking-wider uppercase">
          Đang nạp thông tin đơn hàng...
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="pt-32 pb-24 text-center min-h-[65vh] flex flex-col items-center justify-center bg-[#FAFAFA] text-[#111111]">
        <h2 className="font-serif-luxury text-2xl font-medium mb-3">
          Không tìm thấy thông tin đơn hàng
        </h2>
        <p className="text-xs text-neutral-500 mb-6 font-sans-clean">
          Mã đơn hàng không tồn tại hoặc đã bị xóa.
        </p>
        <button
          onClick={() => onNavigate('/')}
          className="px-6 py-2.5 bg-black text-white text-xs font-semibold uppercase tracking-widest cursor-pointer hover:bg-neutral-800 transition-colors"
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
        success('Hệ thống đã tự động khớp lệnh VietQR thành công!');
      }
    } catch (err: any) {
      error(err.message || 'Không thể cập nhật trạng thái.');
    } finally {
      setIsSimulatingPayment(false);
    }
  };

  // VietQR parameters
  const bankCode = 'MB'; // MB Bank (Ngân hàng TMCP Quân Đội)
  const accountNumber = '0589614334';
  const accountHolder = 'PHAM QUANG THANH';
  const transferContent = `CM ${order.id}`;
  const qrUrl = `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact2.png?amount=${order.totalAmount}&addInfo=${encodeURIComponent(
    transferContent
  )}&accountName=${encodeURIComponent(accountHolder)}`;

  const isBankTransfer = order.paymentMethod === 'bank_transfer';
  const isPaid = order.paymentStatus === 'paid';

  return (
    <div className="pt-24 sm:pt-28 pb-24 bg-[#FAFAFA] min-h-screen text-[#111111]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Success Header Banner */}
        <div className="bg-white border border-neutral-200/80 p-8 sm:p-10 text-center mb-8 shadow-sm relative overflow-hidden">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>

          <span className="text-[11px] font-sans-clean font-bold tracking-[0.25em] uppercase text-neutral-400 block mb-1">
            Đặt Hàng Thành Công
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-medium text-neutral-900 mb-2">
            Cảm ơn quý khách đã tin chọn CMSHOP
          </h1>
          <p className="text-xs text-neutral-600 font-sans-clean max-w-lg mx-auto leading-relaxed">
            Mã đơn hàng của quý khách là <strong className="font-mono text-black font-bold text-sm bg-neutral-100 px-2 py-0.5 border border-neutral-200">#{order.id}</strong>. Hóa đơn chi tiết đã được gửi đến email <strong className="text-black">{order.customer.email}</strong>.
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

        {/* VietQR Bank Payment Portal Card */}
        {isBankTransfer && (
          <div className="bg-white border border-neutral-200 shadow-sm p-6 sm:p-8 mb-8 relative overflow-hidden">
            {/* Top Bar with Bank & Status Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-neutral-100 gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-900 text-white flex items-center justify-center font-bold font-serif-luxury text-sm">
                  MB
                </div>
                <div>
                  <h2 className="font-serif-luxury text-lg font-medium text-neutral-900 flex items-center gap-2">
                    <span>Thanh toán VietQR Napas 247</span>
                    <span className="text-[10px] uppercase font-sans-clean font-bold bg-neutral-100 text-neutral-700 px-2 py-0.5 border border-neutral-200">
                      Tự động 24/7
                    </span>
                  </h2>
                  <p className="text-xs text-neutral-500 font-sans-clean">
                    Ngân hàng TMCP Quân Đội (MB Bank) • Khớp lệnh tức thì
                  </p>
                </div>
              </div>

              <div>
                {isPaid ? (
                  <span className="px-3.5 py-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 border border-emerald-200 rounded-sm">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Đã thanh toán thành công</span>
                  </span>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-neutral-500 font-mono">
                      Hiệu lực: <strong className="text-neutral-900 font-bold">{formatCountdown(countdown)}</strong>
                    </span>
                    <span className="px-3 py-1 bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 border border-amber-200 rounded-sm animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>Chờ chuyển khoản</span>
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* QR Card & Detailed Payment Specs */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
              {/* QR Image Frame */}
              <div className="md:col-span-5 flex flex-col items-center justify-between p-6 bg-[#FAFAFA] border border-neutral-200 rounded-sm">
                <div className="w-full flex items-center justify-between text-[11px] text-neutral-500 font-semibold mb-2">
                  <span className="uppercase tracking-wider">Mã thanh toán QR</span>
                  <span className="font-mono text-black font-bold">MB BANK</span>
                </div>

                <div className="relative group p-3 bg-white border border-neutral-300 shadow-sm transition-transform duration-300 hover:scale-[1.02]">
                  <img
                    src={qrUrl}
                    alt="VietQR MB Bank Payment"
                    className="w-56 h-auto object-contain mx-auto"
                  />
                  {isPaid && (
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-xs flex flex-col items-center justify-center text-emerald-700">
                      <CheckCircle2 className="w-12 h-12 mb-1" />
                      <span className="text-xs font-bold uppercase tracking-wider">Đã khớp lệnh</span>
                    </div>
                  )}
                </div>

                <div className="w-full mt-4 flex items-center justify-center gap-2">
                  <a
                    href={qrUrl}
                    download={`vietqr-order-${order.id}.png`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải ảnh QR về máy</span>
                  </a>
                </div>
              </div>

              {/* Transfer Specs Table */}
              <div className="md:col-span-7 flex flex-col justify-between space-y-2.5 text-xs font-sans-clean">
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-neutral-50 border border-neutral-200">
                    <span className="text-neutral-500">Ngân hàng thụ hưởng:</span>
                    <span className="font-bold text-neutral-900">MB Bank (Ngân Hàng Quân Đội)</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-neutral-50 border border-neutral-200">
                    <span className="text-neutral-500">Chủ tài khoản:</span>
                    <span className="font-bold text-neutral-900 uppercase font-mono">{accountHolder}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-neutral-50 border border-neutral-200">
                    <div>
                      <span className="text-neutral-500 block text-[11px]">Số tài khoản:</span>
                      <span className="font-mono font-bold text-sm text-neutral-900 tracking-wider">
                        {accountNumber}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(accountNumber, 'Số tài khoản')}
                      className="px-2.5 py-1.5 bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-800 font-medium text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedField === 'Số tài khoản' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedField === 'Số tài khoản' ? 'Đã chép' : 'Sao chép'}</span>
                    </button>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-neutral-50 border border-neutral-200">
                    <div>
                      <span className="text-neutral-500 block text-[11px]">Số tiền cần chuyển:</span>
                      <span className="font-bold text-base text-[#111111]">{formatVND(order.totalAmount)}</span>
                    </div>
                    <button
                      onClick={() => handleCopy(order.totalAmount.toString(), 'Số tiền')}
                      className="px-2.5 py-1.5 bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-800 font-medium text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedField === 'Số tiền' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedField === 'Số tiền' ? 'Đã chép' : 'Sao chép'}</span>
                    </button>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-amber-50/60 border border-amber-200">
                    <div>
                      <span className="text-amber-800 font-semibold block text-[11px]">
                        Nội dung chuyển khoản (Bắt buộc giữ nguyên):
                      </span>
                      <span className="font-mono font-bold text-sm text-black">{transferContent}</span>
                    </div>
                    <button
                      onClick={() => handleCopy(transferContent, 'Nội dung chuyển khoản')}
                      className="px-2.5 py-1.5 bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-800 font-medium text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedField === 'Nội dung chuyển khoản' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedField === 'Nội dung chuyển khoản' ? 'Đã chép' : 'Sao chép'}</span>
                    </button>
                  </div>
                </div>

                {!isPaid && (
                  <button
                    onClick={handleSimulatePaymentConfirmation}
                    disabled={isSimulatingPayment}
                    className="w-full py-3 mt-3 bg-neutral-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                  >
                    {isSimulatingPayment ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Đang đối soát giao dịch ngân hàng...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Xác nhận đã chuyển khoản</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Order Details & Items Summary */}
        <div className="bg-white border border-neutral-200 p-6 sm:p-8 space-y-6 shadow-sm">
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
              <span className="font-mono font-bold text-xs text-neutral-900 bg-neutral-100 px-2 py-0.5 border border-neutral-200">
                {order.trackingNumber}
              </span>
            </div>
          </div>

          {/* Customer & Shipping Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans-clean pb-6 border-b border-neutral-200">
            <div>
              <h4 className="font-bold uppercase tracking-wider text-neutral-900 mb-2">
                Địa chỉ nhận hàng
              </h4>
              <p className="text-neutral-900 font-semibold">{order.customer.fullName}</p>
              <p className="text-neutral-600 font-mono">{order.customer.phoneNumber}</p>
              <p className="text-neutral-600 mt-1">
                {order.customer.streetAddress}, {order.customer.ward}, {order.customer.district}, {order.customer.province}
              </p>
            </div>

            <div>
              <h4 className="font-bold uppercase tracking-wider text-neutral-900 mb-2">
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
                <strong className="text-neutral-900 uppercase">{order.paymentMethod === 'bank_transfer' ? 'Chuyển khoản VietQR MB' : order.paymentMethod}</strong>
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
              <div key={idx} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-14 h-16 object-cover bg-neutral-100 border border-neutral-200 shrink-0"
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
                  <span className="text-xs font-bold text-neutral-900">{formatVND(item.subtotal)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Order Financials */}
          <div className="pt-4 border-t border-neutral-200 space-y-2 text-xs font-sans-clean">
            <div className="flex justify-between text-neutral-600">
              <span>Tạm tính</span>
              <span className="font-mono">{formatVND(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Phí vận chuyển</span>
              <span className="font-mono">{order.shippingFee === 0 ? 'Miễn phí' : formatVND(order.shippingFee)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Giảm giá ({order.appliedCoupon})</span>
                <span className="font-mono">-{formatVND(order.discountAmount)}</span>
              </div>
            )}
            <div className="pt-3 border-t border-neutral-200 flex justify-between items-baseline">
              <span className="text-sm font-bold text-neutral-900">Tổng thanh toán</span>
              <span className="text-xl font-bold text-[#111111] font-mono">{formatVND(order.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
