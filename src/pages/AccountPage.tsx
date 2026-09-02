import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  Package,
  MapPin,
  Heart,
  LogOut,
  ChevronRight,
  Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { orderService } from '../services/orderService';
import { Order, OrderStatus } from '../types';
import { formatVND, formatDate } from '../utils/format';

interface AccountPageProps {
  onNavigate: (path: string) => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ onNavigate }) => {
  const { user, isAuthenticated, logout, updateProfile, openAuthModal } = useAuth();
  const { wishlistProducts, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses' | 'wishlist'>('profile');

  // Profile Form state
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phoneNumber || '');
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setLoadingOrders(true);
      orderService
        .getOrders()
        .then((data) => setUserOrders(data))
        .catch((err) => console.error(err))
        .finally(() => setLoadingOrders(false));
    }
  }, [isAuthenticated, activeTab]);

  if (!isAuthenticated || !user) {
    return (
      <div className="pt-32 pb-24 text-center min-h-[65vh] flex flex-col items-center justify-center bg-[#FAFAFA] text-[#111111]">
        <div className="w-16 h-16 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center mb-4 text-neutral-400">
          <UserIcon className="w-8 h-8 stroke-[1.5]" />
        </div>
        <h2 className="font-serif-luxury text-2xl sm:text-3xl font-medium mb-2">
          Đăng nhập vào tài khoản CM
        </h2>
        <p className="text-xs text-neutral-500 font-sans-clean max-w-sm mb-6">
          Vui lòng đăng nhập để xem lịch sử đơn hàng, cập nhật thông tin cá nhân và quản lý danh sách yêu thích.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="px-8 py-3 bg-[#111111] text-white text-xs font-semibold tracking-widest uppercase hover:bg-black transition-colors cursor-pointer"
        >
          Đăng nhập ngay
        </button>
      </div>
    );
  }

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      error('Vui lòng điền đầy đủ họ tên.');
      return;
    }
    updateProfile({ fullName: fullName.trim(), phoneNumber: phone.trim() });
    success('Đã cập nhật thông tin cá nhân.');
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'shipping':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing':
      case 'confirmed':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'pending':
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'processing':
        return 'Đang chuẩn bị hàng';
      case 'shipping':
        return 'Đang giao hàng';
      case 'delivered':
        return 'Đã giao thành công';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  return (
    <div className="pt-24 sm:pt-28 pb-20 bg-[#FAFAFA] min-h-screen text-[#111111]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Account Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-neutral-200 gap-4 mb-8">
          <div>
            <span className="text-[11px] font-sans-clean font-semibold tracking-[0.25em] uppercase text-neutral-400 block mb-1">
              Trung Tâm Khách Hàng
            </span>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl font-medium text-neutral-900">
              Chào mừng, {user.fullName}
            </h1>
            <p className="text-xs text-neutral-500 font-sans-clean mt-1">
              Thành viên CM • {user.email}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {user.role === 'admin' && (
              <button
                onClick={() => onNavigate('/admin')}
                className="px-4 py-2 bg-neutral-900 hover:bg-black text-amber-400 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer border border-neutral-800"
              >
                Cổng Quản trị Admin
              </button>
            )}
            <button
              onClick={logout}
              className="px-4 py-2 bg-white border border-neutral-300 hover:border-black text-xs font-semibold uppercase tracking-wider text-neutral-700 hover:text-black flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>

        {/* Account Main Tabs & Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Navigation Sidebar (Col 3) */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-neutral-200 p-4 space-y-1 text-xs font-sans-clean">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 transition-colors cursor-pointer font-medium ${
                  activeTab === 'profile'
                    ? 'bg-[#111111] text-white'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
                }`}
              >
                <UserIcon className="w-4 h-4" />
                <span>Thông tin cá nhân</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center justify-between px-3 py-2.5 transition-colors cursor-pointer font-medium ${
                  activeTab === 'orders'
                    ? 'bg-[#111111] text-white'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4" />
                  <span>Đơn hàng của tôi</span>
                </div>
                <span className="text-[11px] opacity-75">({userOrders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 transition-colors cursor-pointer font-medium ${
                  activeTab === 'addresses'
                    ? 'bg-[#111111] text-white'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Sổ địa chỉ</span>
              </button>

              <button
                onClick={() => setActiveTab('wishlist')}
                className={`w-full flex items-center justify-between px-3 py-2.5 transition-colors cursor-pointer font-medium ${
                  activeTab === 'wishlist'
                    ? 'bg-[#111111] text-white'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Heart className="w-4 h-4" />
                  <span>Danh sách yêu thích</span>
                </div>
                <span className="text-[11px] opacity-75">({wishlistProducts.length})</span>
              </button>
            </div>
          </div>

          {/* Right Main Content (Col 9) */}
          <div className="lg:col-span-9">
            {/* 1. Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white border border-neutral-200 p-6 sm:p-8">
                <h3 className="font-serif-luxury text-xl font-medium text-neutral-900 mb-4 pb-3 border-b border-neutral-100">
                  Thông tin tài khoản
                </h3>

                <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-lg text-xs">
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                      Địa chỉ Email (Không thể thay đổi)
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full bg-neutral-100 border border-neutral-300 px-3 py-2.5 text-xs text-neutral-500 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full bg-neutral-50 border border-neutral-300 px-3 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-300 px-3 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-black"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#111111] text-white text-xs font-semibold tracking-widest uppercase hover:bg-black transition-colors cursor-pointer"
                  >
                    Lưu thay đổi
                  </button>
                </form>
              </div>
            )}

            {/* 2. Orders History Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="bg-white border border-neutral-200 p-6 sm:p-8">
                  <h3 className="font-serif-luxury text-xl font-medium text-neutral-900 mb-6 pb-3 border-b border-neutral-100">
                    Lịch sử đơn hàng ({userOrders.length})
                  </h3>

                  {userOrders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                      <p className="font-serif-luxury text-lg text-neutral-800">Bạn chưa có đơn hàng nào</p>
                      <button
                        onClick={() => onNavigate('/products')}
                        className="px-6 py-2 bg-black text-white text-xs uppercase tracking-wider mt-4"
                      >
                        Bắt đầu mua sắm
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userOrders.map((order) => (
                        <div
                          key={order.id}
                          className="border border-neutral-200 p-5 hover:border-neutral-400 transition-all bg-neutral-50/50"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-200 gap-2 text-xs font-sans-clean">
                            <div>
                              <span className="font-mono font-bold text-neutral-900">#{order.id}</span>
                              <span className="text-neutral-400 ml-2">• {formatDate(order.createdAt)}</span>
                            </div>
                            <span
                              className={`px-2.5 py-0.5 text-[10px] font-semibold uppercase border ${getStatusBadge(
                                order.orderStatus
                              )}`}
                            >
                              {getStatusLabel(order.orderStatus)}
                            </span>
                          </div>

                          {/* Items Preview */}
                          <div className="py-3 flex flex-wrap gap-2 items-center">
                            {order.items.map((it, idx) => (
                              <div key={idx} className="flex items-center gap-2 bg-white p-1.5 border border-neutral-200">
                                <img src={it.productImage} alt={it.productName} className="w-8 h-10 object-cover" />
                                <span className="text-[11px] text-neutral-800 max-w-[140px] truncate">
                                  {it.productName} (x{it.quantity})
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-neutral-200 text-xs">
                            <span className="text-neutral-600">
                              Tổng thanh toán: <strong className="text-black font-bold">{formatVND(order.totalAmount)}</strong>
                            </span>
                            <button
                              onClick={() => onNavigate(`/order-success/${order.id}`)}
                              className="text-xs font-semibold uppercase text-neutral-800 hover:text-black flex items-center gap-1 cursor-pointer"
                            >
                              <span>Xem chi tiết & Hóa đơn</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="bg-white border border-neutral-200 p-6 sm:p-8">
                <h3 className="font-serif-luxury text-xl font-medium text-neutral-900 mb-6 pb-3 border-b border-neutral-100 flex items-center justify-between">
                  <span>Sổ địa chỉ nhận hàng</span>
                </h3>

                <div className="border border-neutral-200 p-5 bg-neutral-50 relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 text-[10px] font-semibold uppercase bg-black text-white">
                      Địa chỉ mặc định
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-neutral-900">{user.fullName}</p>
                  <p className="text-xs text-neutral-600 mt-1">{user.phoneNumber || 'Chưa cập nhật SĐT'}</p>
                  <p className="text-xs text-neutral-700 mt-1">
                    {user.addresses?.[0]
                      ? `${user.addresses[0].streetAddress}, ${user.addresses[0].ward}, ${user.addresses[0].district}, ${user.addresses[0].province}`
                      : 'Chưa lưu địa chỉ giao hàng cụ thể.'}
                  </p>
                </div>
              </div>
            )}

            {/* 4. Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="bg-white border border-neutral-200 p-6 sm:p-8">
                <h3 className="font-serif-luxury text-xl font-medium text-neutral-900 mb-6 pb-3 border-b border-neutral-100">
                  Sản phẩm yêu thích ({wishlistProducts.length})
                </h3>

                {wishlistProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                    <p className="font-serif-luxury text-lg text-neutral-800">Chưa có sản phẩm nào trong yêu thích</p>
                    <button
                      onClick={() => onNavigate('/products')}
                      className="px-6 py-2 bg-black text-white text-xs uppercase tracking-wider mt-4"
                    >
                      Khám phá ngay
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlistProducts.map((p) => (
                      <div key={p.id} className="border border-neutral-200 p-3 flex gap-3 items-center">
                        <img src={p.images[0]} alt={p.name} className="w-16 h-20 object-cover bg-neutral-100 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-medium text-neutral-900 truncate">{p.name}</h4>
                          <p className="text-xs font-semibold text-black mt-1">{formatVND(p.price)}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => {
                                addToCart(p, 1, undefined, p.colors?.[0]?.name, p.sizes?.[0], true);
                                removeFromWishlist(p.id);
                              }}
                              className="px-3 py-1 bg-black text-white text-[10px] uppercase font-semibold hover:bg-neutral-800"
                            >
                              Thêm vào giỏ
                            </button>
                            <button
                              onClick={() => removeFromWishlist(p.id)}
                              className="text-neutral-400 hover:text-rose-600 p-1"
                              title="Xóa"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
