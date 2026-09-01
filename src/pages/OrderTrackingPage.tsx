import React, { useState, useEffect } from 'react';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
  ChevronRight,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { orderService } from '../services/orderService';
import { Order, OrderStatus } from '../types';
import { formatVND, formatDate } from '../utils/format';

interface OrderTrackingPageProps {
  initialOrderId?: string;
  onNavigate: (path: string) => void;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({ initialOrderId = '', onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState(initialOrderId);
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (initialOrderId) {
      handleSearchById(initialOrderId);
    }
  }, [initialOrderId]);

  const handleSearchById = async (query: string) => {
    const cleanQuery = query.trim().toUpperCase();
    if (!cleanQuery) {
      setErrorMessage('Vui lòng nhập mã đơn hàng (ví dụ: CM-1001) hoặc số điện thoại.');
      return;
    }

    setErrorMessage('');
    setHasSearched(true);
    setIsSearching(true);

    try {
      // First try single order fetch by ID
      const directOrder = await orderService.getOrderById(cleanQuery);
      if (directOrder) {
        setSearchedOrder(directOrder);
        setIsSearching(false);
        return;
      }
    } catch {
      // Continue to list search
    }

    try {
      const orders = await orderService.getOrders();
      const found = orders.find(
        (o) =>
          o.id.toUpperCase() === cleanQuery ||
          o.id.replace('CM-', '').toUpperCase() === cleanQuery ||
          o.customer.phoneNumber === cleanQuery
      );

      if (found) {
        setSearchedOrder(found);
      } else {
        setSearchedOrder(null);
      }
    } catch {
      setSearchedOrder(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearchById(searchQuery);
  };

  const getTimelineSteps = (status: OrderStatus) => {
    const steps = [
      { key: 'pending', title: 'Đặt hàng thành công', desc: 'Đơn hàng đã được tiếp nhận vào hệ thống' },
      { key: 'confirmed', title: 'Đã xác nhận', desc: 'Nhân viên CM đã xác thực thông tin đơn hàng' },
      { key: 'processing', title: 'Đang đóng gói', desc: 'Sản phẩm được tuyển chọn và đóng hộp cao cấp' },
      { key: 'shipping', title: 'Đang vận chuyển', desc: 'Đơn vị vận chuyển đang giao đến địa chỉ của bạn' },
      { key: 'delivered', title: 'Giao hàng thành công', desc: 'Khách hàng đã nhận và đồng kiểm sản phẩm' },
    ];

    const statusWeights: Record<OrderStatus, number> = {
      pending: 1,
      confirmed: 2,
      processing: 3,
      shipping: 4,
      delivered: 5,
      cancelled: 0,
    };

    const currentWeight = statusWeights[status] || 1;

    return steps.map((step, index) => {
      const stepNumber = index + 1;
      let state: 'completed' | 'current' | 'upcoming' = 'upcoming';

      if (status === 'cancelled') {
        state = index === 0 ? 'completed' : 'upcoming';
      } else if (stepNumber < currentWeight) {
        state = 'completed';
      } else if (stepNumber === currentWeight) {
        state = 'current';
      }

      return { ...step, state };
    });
  };

  return (
    <div className="pt-28 sm:pt-32 pb-24 bg-[#FAFAFA] min-h-screen text-[#111111]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] font-sans font-semibold tracking-[0.3em] uppercase text-neutral-400 block mb-2">
            Hệ Thống Tra Cứu Trực Tuyến
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-neutral-900 tracking-wide mb-3">
            Theo dõi hành trình đơn hàng
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 font-sans leading-relaxed">
            Nhập mã đơn hàng hoặc số điện thoại đặt hàng để cập nhật trạng thái vận chuyển theo thời gian thực.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="bg-white border border-[#E5E5E1] p-6 sm:p-8 max-w-2xl mx-auto shadow-xs mb-12">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nhập mã đơn hàng (VD: CM-1001) hoặc Số điện thoại..."
                className="w-full bg-[#F9F9F7] border border-[#E5E5E1] pl-10 pr-4 py-3 text-xs sm:text-sm text-[#1A1A1A] placeholder-neutral-400 focus:outline-none focus:border-[#1A1A1A] transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3 bg-[#1A1A1A] text-white hover:bg-neutral-800 text-xs font-semibold tracking-[0.15em] uppercase transition-colors cursor-pointer shrink-0"
            >
              Tra cứu
            </button>
          </form>

          {errorMessage && (
            <p className="text-xs text-rose-600 mt-2 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errorMessage}</span>
            </p>
          )}

          {/* Quick Demo Help */}
          <div className="mt-4 pt-4 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-neutral-400">
            <span>Mẹo: Bạn có thể tìm thấy mã đơn hàng trong email xác nhận hoặc tại trang cá nhân.</span>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('CM-1001');
                handleSearchById('CM-1001');
              }}
              className="text-[#1A1A1A] underline hover:opacity-70 cursor-pointer font-medium"
            >
              Xem đơn mẫu CM-1001
            </button>
          </div>
        </div>

        {/* Search Results Display */}
        {hasSearched && (
          <div>
            {searchedOrder ? (
              <div className="bg-white border border-[#E5E5E1] overflow-hidden shadow-xs">
                {/* Order Top Banner */}
                <div className="p-6 sm:p-8 bg-[#F9F9F7] border-b border-[#E5E5E1] flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">
                        Đơn hàng #{searchedOrder.id}
                      </h2>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-none border ${
                          searchedOrder.status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : searchedOrder.status === 'shipping'
                            ? 'bg-blue-100 text-blue-800 border-blue-200'
                            : searchedOrder.status === 'cancelled'
                            ? 'bg-rose-100 text-rose-800 border-rose-200'
                            : 'bg-amber-100 text-amber-800 border-amber-200'
                        }`}
                      >
                        {searchedOrder.status === 'delivered' && 'Giao hàng thành công'}
                        {searchedOrder.status === 'shipping' && 'Đang vận chuyển'}
                        {searchedOrder.status === 'processing' && 'Đang đóng gói'}
                        {searchedOrder.status === 'confirmed' && 'Đã xác nhận'}
                        {searchedOrder.status === 'pending' && 'Chờ xác nhận'}
                        {searchedOrder.status === 'cancelled' && 'Đã hủy'}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Ngày đặt: {formatDate(searchedOrder.createdAt)}</span>
                      <span>•</span>
                      <span>Thanh toán: <strong className="uppercase text-neutral-800">{searchedOrder.paymentMethod}</strong> ({searchedOrder.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'})</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-neutral-500 block">Tổng giá trị đơn hàng</span>
                    <span className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">
                      {formatVND(searchedOrder.totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Tracking Progress Timeline */}
                <div className="p-6 sm:p-10 border-b border-[#E5E5E1]">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#1A1A1A] mb-8">
                    Tiến độ xử lý & Vận chuyển
                  </h3>

                  <div className="relative">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
                      {getTimelineSteps(searchedOrder.status).map((step, idx) => (
                        <div key={step.key} className="flex md:flex-col items-start gap-4 md:gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                              step.state === 'completed'
                                ? 'bg-[#1A1A1A] text-white'
                                : step.state === 'current'
                                ? 'bg-amber-600 text-white ring-4 ring-amber-100'
                                : 'bg-neutral-100 text-neutral-400 border border-neutral-200'
                            }`}
                          >
                            {step.state === 'completed' ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : (
                              <span>{idx + 1}</span>
                            )}
                          </div>
                          <div>
                            <h4
                              className={`text-xs font-semibold ${
                                step.state === 'current'
                                  ? 'text-amber-800 font-bold'
                                  : step.state === 'completed'
                                  ? 'text-[#1A1A1A]'
                                  : 'text-neutral-400'
                              }`}
                            >
                              {step.title}
                            </h4>
                            <p className="text-[11px] text-neutral-500 leading-tight mt-1">
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Order Details & Shipping Info Grid */}
                <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Recipient Information */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#1A1A1A] mb-3 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Thông tin giao nhận</span>
                    </h4>
                    <div className="bg-[#F9F9F7] p-4 border border-[#E5E5E1] text-xs space-y-1.5 text-neutral-600 leading-relaxed">
                      <p><strong className="text-[#1A1A1A]">Người nhận:</strong> {searchedOrder.customer.fullName}</p>
                      <p><strong className="text-[#1A1A1A]">Số điện thoại:</strong> {searchedOrder.customer.phoneNumber}</p>
                      <p><strong className="text-[#1A1A1A]">Email:</strong> {searchedOrder.customer.email}</p>
                      <p>
                        <strong className="text-[#1A1A1A]">Địa chỉ:</strong> {searchedOrder.customer.streetAddress}, {searchedOrder.customer.ward}, {searchedOrder.customer.district}, {searchedOrder.customer.province}
                      </p>
                      {searchedOrder.customer.note && (
                        <p className="pt-1 text-neutral-500 italic">
                          <strong>Ghi chú:</strong> "{searchedOrder.customer.note}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#1A1A1A] mb-3 flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5" />
                      <span>Danh sách sản phẩm ({searchedOrder.items.length})</span>
                    </h4>
                    <div className="divide-y divide-neutral-100 max-h-56 overflow-y-auto pr-1">
                      {searchedOrder.items.map((item, idx) => (
                        <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-semibold text-neutral-900">{item.productName}</p>
                            {item.selectedVariantText && (
                              <p className="text-[11px] text-neutral-500">{item.selectedVariantText}</p>
                            )}
                            <p className="text-[11px] text-neutral-500">Số lượng: {item.quantity}</p>
                          </div>
                          <span className="font-semibold text-neutral-900">
                            {formatVND(item.unitPrice * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-[#E5E5E1] p-12 text-center max-w-md mx-auto">
                <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4 text-neutral-400">
                  <Package className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#1A1A1A] mb-2">
                  Không tìm thấy đơn hàng
                </h3>
                <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
                  Không tìm thấy đơn hàng nào khớp với từ khóa "{searchQuery}". Vui lòng kiểm tra lại mã đơn hàng hoặc số điện thoại.
                </p>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="px-6 py-2.5 bg-[#1A1A1A] text-white text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Liên hệ bộ phận CSKH
                </button>
              </div>
            )}
          </div>
        )}

        {/* Commitment Badge */}
        <div className="mt-16 p-6 bg-white border border-[#E5E5E1] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-600">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#1A1A1A] shrink-0" />
            <div>
              <p className="font-semibold text-[#1A1A1A]">Đồng kiểm trước khi nhận hàng</p>
              <p className="text-[11px] text-neutral-500">Quý khách hoàn toàn được quyền mở hộp kiểm tra sản phẩm trước khi thanh toán cho đơn vị vận chuyển.</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('/faq')}
            className="text-xs font-semibold text-[#1A1A1A] underline hover:opacity-75 cursor-pointer shrink-0"
          >
            Xem câu hỏi thường gặp
          </button>
        </div>
      </div>
    </div>
  );
};
