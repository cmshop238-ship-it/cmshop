import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tag,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  DollarSign,
  X,
  History,
  MessageSquare,
  Settings,
  RefreshCw,
  Eye,
  CheckCircle,
  Clock,
  Truck,
  Database
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { orderService } from '../services/orderService';
import { reviewService } from '../services/reviewService';
import { settingsService } from '../services/settingsService';
import { Product, ProductCategory, Order, OrderStatus, PaymentStatus, Coupon } from '../types';
import { formatVND, formatDate } from '../utils/format';

interface AdminDashboardPageProps {
  onNavigate: (path: string) => void;
}

const CATEGORY_LIST: ProductCategory[] = [
  'Thời trang',
  'Giày',
  'Đồng hồ',
  'Túi & Ví',
  'Công nghệ',
  'Phụ kiện',
];

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const { products, addProduct, updateProduct, deleteProduct, coupons, addCoupon, toggleCouponStatus, deleteCoupon, refreshCatalog } = useShop();
  const { user, isAdmin } = useAuth();
  const { success, error, info } = useToast();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'coupons' | 'inventory' | 'reviews' | 'settings'>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [inventoryLogs, setInventoryLogs] = useState<any[]>([]);
  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [storeSettings, setStoreSettings] = useState<any>(null);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Filters
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState<ProductCategory>('Thời trang');
  const [prodPrice, setProdPrice] = useState<number>(0);
  const [prodOriginalPrice, setProdOriginalPrice] = useState<number>(0);
  const [prodStock, setProdStock] = useState<number>(10);
  const [prodSku, setProdSku] = useState('');
  const [prodShortDesc, setProdShortDesc] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodBrand, setProdBrand] = useState('CM Official');
  const [prodMaterial, setProdMaterial] = useState('');
  const [prodOrigin, setProdOrigin] = useState('');

  // Stock Adjustment Modal
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [selectedStockProduct, setSelectedStockProduct] = useState<Product | null>(null);
  const [stockAdjustVal, setStockAdjustVal] = useState(0);
  const [stockAdjustReason, setStockAdjustReason] = useState('Nhập hàng bổ sung');

  // Coupon Modal State
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponType, setCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [couponValue, setCouponValue] = useState<number>(10);
  const [couponMinOrder, setCouponMinOrder] = useState<number>(500000);
  const [couponMaxDiscount, setCouponMaxDiscount] = useState<number>(0);

  const loadData = async () => {
    try {
      setLoadingOrders(true);
      const [ordList, logs, revs, anl, sets] = await Promise.all([
        orderService.getOrders(orderStatusFilter).catch(() => []),
        settingsService.getInventoryLogs().catch(() => []),
        reviewService.getAllReviewsAdmin().catch(() => []),
        settingsService.getAnalytics().catch(() => null),
        settingsService.getSettings().catch(() => null),
      ]);
      setOrders(ordList);
      setInventoryLogs(logs);
      setReviewsList(revs);
      setAnalytics(anl);
      setStoreSettings(sets);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [orderStatusFilter]);

  // Handle Product Save
  const handleOpenProductModal = (prod?: Product) => {
    if (prod) {
      setEditingProduct(prod);
      setProdName(prod.name);
      setProdCategory(prod.category);
      setProdPrice(prod.price);
      setProdOriginalPrice(prod.originalPrice || 0);
      setProdStock(prod.stock);
      setProdSku(prod.sku);
      setProdShortDesc(prod.shortDescription || '');
      setProdDesc(prod.description || '');
      setProdImage(prod.images[0] || '');
      setProdBrand(prod.brand || 'CM Official');
      setProdMaterial(prod.material || '');
      setProdOrigin(prod.origin || '');
    } else {
      setEditingProduct(null);
      setProdName('');
      setProdCategory('Thời trang');
      setProdPrice(1500000);
      setProdOriginalPrice(1800000);
      setProdStock(25);
      setProdSku(`CM-${Date.now().toString().slice(-4)}`);
      setProdShortDesc('Sản phẩm cao cấp được thiết kế riêng bởi CM Studio.');
      setProdDesc('Chất liệu nhập khẩu cao cấp, hoàn thiện tỉ mỉ từng chi tiết theo tiêu chuẩn thủ công quốc tế.');
      setProdImage('https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop');
      setProdBrand('CM Official');
      setProdMaterial('Premium Fabric');
      setProdOrigin('Việt Nam');
    }
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim() || prodPrice <= 0) {
      error('Vui lòng nhập tên sản phẩm và mức giá hợp lệ.');
      return;
    }

    if (editingProduct) {
      await updateProduct(editingProduct.id, {
        name: prodName.trim(),
        category: prodCategory,
        price: Number(prodPrice),
        originalPrice: prodOriginalPrice > 0 ? Number(prodOriginalPrice) : undefined,
        stock: Number(prodStock),
        sku: prodSku.trim() || `CM-${Date.now().toString().slice(-4)}`,
        shortDescription: prodShortDesc.trim(),
        description: prodDesc.trim(),
        images: [prodImage.trim() || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop'],
        brand: prodBrand.trim(),
        material: prodMaterial.trim(),
        origin: prodOrigin.trim(),
      });
    } else {
      const slug = prodName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      await addProduct({
        slug: slug || `cm-item-${Date.now()}`,
        name: prodName.trim(),
        category: prodCategory,
        price: Number(prodPrice),
        originalPrice: prodOriginalPrice > 0 ? Number(prodOriginalPrice) : undefined,
        stock: Number(prodStock),
        sku: prodSku.trim() || `CM-${Date.now().toString().slice(-4)}`,
        shortDescription: prodShortDesc.trim(),
        description: prodDesc.trim(),
        images: [prodImage.trim() || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop'],
        brand: prodBrand.trim(),
        material: prodMaterial.trim(),
        origin: prodOrigin.trim(),
        features: ['Chế tác thủ công cao cấp', 'Bảo hành chính hãng 12 tháng', 'Đóng gói quà tặng sang trọng'],
        specifications: { 'Thương hiệu': prodBrand || 'CM Official', 'Xuất xứ': prodOrigin || 'Việt Nam' },
        isNew: true,
        status: 'active',
      });
    }

    setIsProductModalOpen(false);
    loadData();
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}" khỏi cơ sở dữ liệu?`)) {
      await deleteProduct(id);
      loadData();
    }
  };

  const handleOpenStockModal = (p: Product) => {
    setSelectedStockProduct(p);
    setStockAdjustVal(p.stock);
    setStockAdjustReason('Cập nhật kiểm kho định kỳ');
    setIsStockModalOpen(true);
  };

  const handleSaveStockAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStockProduct) return;

    try {
      await settingsService.adjustStock(selectedStockProduct.id, stockAdjustVal, stockAdjustReason);
      success(`Đã cập nhật tồn kho "${selectedStockProduct.name}" thành ${stockAdjustVal}`);
      setIsStockModalOpen(false);
      refreshCatalog();
      loadData();
    } catch (err: any) {
      error(err.message || 'Lỗi cập nhật tồn kho.');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const updated = await orderService.updateOrderStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      success(`Đã đổi trạng thái đơn #${orderId} sang "${newStatus}"`);
    } catch (err: any) {
      error(err.message || 'Lỗi cập nhật trạng thái đơn.');
    }
  };

  const handleUpdatePaymentStatus = async (orderId: string, newPayStatus: PaymentStatus) => {
    try {
      const updated = await orderService.updatePaymentStatus(orderId, newPayStatus);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      success(`Đã cập nhật thanh toán đơn #${orderId} sang "${newPayStatus}"`);
    } catch (err: any) {
      error(err.message || 'Lỗi cập nhật thanh toán.');
    }
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    const ok = await addCoupon({
      code: couponCode.trim().toUpperCase(),
      discountType: couponType,
      discountValue: Number(couponValue),
      minimumOrder: Number(couponMinOrder),
      maxDiscount: couponMaxDiscount > 0 ? Number(couponMaxDiscount) : undefined,
      description: `Mã ưu đãi ${couponCode.toUpperCase()}`,
      isActive: true,
      startDate: new Date().toISOString(),
      endDate: '2026-12-31T23:59:59.000Z',
    });

    if (ok) {
      setCouponCode('');
      setIsCouponModalOpen(false);
    }
  };

  const handleToggleReviewStatus = async (reviewId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'hidden' : 'active';
      const updated = await reviewService.updateReviewStatus(reviewId, newStatus);
      setReviewsList((prev) => prev.map((r) => (r.id === reviewId ? updated : r)));
      success(`Đã chuyển trạng thái đánh giá sang ${newStatus}`);
    } catch (err: any) {
      error(err.message || 'Lỗi cập nhật đánh giá.');
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (window.confirm('Bạn có chắc muốn xóa đánh giá này?')) {
      try {
        await reviewService.deleteReview(reviewId);
        setReviewsList((prev) => prev.filter((r) => r.id !== reviewId));
        success('Đã xóa đánh giá.');
      } catch (err: any) {
        error(err.message || 'Không thể xóa đánh giá.');
      }
    }
  };

  const handleSwitchDataMode = async (mode: 'demo' | 'clean') => {
    const confirmMsg =
      mode === 'clean'
        ? 'Bạn có chắc chắn muốn chuyển sang CHẾ ĐỘ BÁN HÀNG THẬT (Clean)? Hệ thống sẽ làm sạch dữ liệu demo để bạn sẵn sàng đăng sản phẩm thật và bán hàng.'
        : 'Bạn có chắc chắn muốn nạp lại DỮ LIỆU DEMO (Catalog mẫu)?';

    if (window.confirm(confirmMsg)) {
      try {
        const res = await settingsService.switchDataMode(mode);
        success(res.message);
        refreshCatalog();
        loadData();
      } catch (err: any) {
        error(err.message || 'Lỗi chuyển chế độ dữ liệu.');
      }
    }
  };

  const filteredProducts = products.filter(
    (p) => productCategoryFilter === 'all' || p.category === productCategoryFilter
  );

  const totalRevenue = orders.reduce(
    (sum, o) => sum + (o.paymentStatus === 'paid' ? o.totalAmount : 0),
    0
  );
  const lowStockProducts = products.filter((p) => p.stock <= 5);

  return (
    <div className="pt-24 sm:pt-28 pb-20 bg-[#FAFAFA] min-h-screen text-[#111111]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-200 gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-[10px] font-semibold uppercase bg-black text-amber-400 tracking-wider">
                CM Enterprise Control Center
              </span>
              <span className="text-xs text-neutral-500 font-mono">Domain: cmshop.online</span>
            </div>
            <h1 className="font-serif-luxury text-3xl font-medium text-neutral-900">
              Quản Trị Hệ Thống CM Luxury
            </h1>
            <p className="text-xs text-neutral-500 font-sans-clean">
              Quản lý sản phẩm thật, đơn hàng, kho vận, đánh giá khách hàng và cấu hình thanh toán.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => loadData()}
              className="p-2 border border-neutral-300 bg-white hover:border-black rounded text-neutral-700 cursor-pointer"
              title="Làm mới dữ liệu"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('/')}
              className="px-4 py-2 bg-white border border-neutral-300 text-xs font-semibold uppercase tracking-wider text-neutral-700 hover:border-black transition-colors cursor-pointer"
            >
              Về trang bán hàng
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex border-b border-neutral-200 mb-8 overflow-x-auto text-xs uppercase tracking-wider font-semibold scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-5 flex items-center gap-2 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === 'overview' ? 'border-b-2 border-black text-black bg-white' : 'text-neutral-500 hover:text-black'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Tổng quan</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`py-3 px-5 flex items-center gap-2 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === 'products' ? 'border-b-2 border-black text-black bg-white' : 'text-neutral-500 hover:text-black'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Sản phẩm ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-5 flex items-center gap-2 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === 'orders' ? 'border-b-2 border-black text-black bg-white' : 'text-neutral-500 hover:text-black'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Đơn hàng ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`py-3 px-5 flex items-center gap-2 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === 'coupons' ? 'border-b-2 border-black text-black bg-white' : 'text-neutral-500 hover:text-black'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Mã giảm giá ({coupons.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-3 px-5 flex items-center gap-2 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === 'inventory' ? 'border-b-2 border-black text-black bg-white' : 'text-neutral-500 hover:text-black'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Nhật ký kho ({inventoryLogs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3 px-5 flex items-center gap-2 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === 'reviews' ? 'border-b-2 border-black text-black bg-white' : 'text-neutral-500 hover:text-black'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Đánh giá ({reviewsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-5 flex items-center gap-2 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === 'settings' ? 'border-b-2 border-black text-black bg-white' : 'text-neutral-500 hover:text-black'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Cài đặt & Dữ liệu</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-neutral-200 p-6">
                <div className="flex items-center justify-between text-neutral-500 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Doanh thu thực thu</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-bold font-sans-clean text-neutral-900">
                  {formatVND(totalRevenue)}
                </div>
                <span className="text-[11px] text-emerald-600 mt-1 block font-medium">
                  Authoritative Price Engine
                </span>
              </div>

              <div className="bg-white border border-neutral-200 p-6">
                <div className="flex items-center justify-between text-neutral-500 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Tổng đơn hàng</span>
                  <ShoppingCart className="w-4 h-4 text-neutral-800" />
                </div>
                <div className="text-2xl font-bold font-sans-clean text-neutral-900">
                  {orders.length}
                </div>
                <span className="text-[11px] text-neutral-500 mt-1 block">
                  {orders.filter((o) => o.orderStatus === 'pending').length} đơn đang chờ xử lý
                </span>
              </div>

              <div className="bg-white border border-neutral-200 p-6">
                <div className="flex items-center justify-between text-neutral-500 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Sản phẩm hoạt động</span>
                  <Package className="w-4 h-4 text-neutral-800" />
                </div>
                <div className="text-2xl font-bold font-sans-clean text-neutral-900">
                  {products.length}
                </div>
                <span className="text-[11px] text-neutral-500 mt-1 block">Cơ sở dữ liệu đồng bộ</span>
              </div>

              <div className="bg-white border border-neutral-200 p-6">
                <div className="flex items-center justify-between text-neutral-500 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Cảnh báo tồn kho</span>
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl font-bold font-sans-clean text-amber-700">
                  {lowStockProducts.length}
                </div>
                <span className="text-[11px] text-amber-600 mt-1 block">Sản phẩm còn ≤ 5 cái</span>
              </div>
            </div>

            {/* Low stock alerts */}
            {lowStockProducts.length > 0 && (
              <div className="bg-white border border-amber-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-900">
                    Cảnh báo: Sản phẩm sắp hết hàng cần bổ sung
                  </h3>
                </div>
                <div className="divide-y divide-neutral-100 text-xs">
                  {lowStockProducts.map((p) => (
                    <div key={p.id} className="py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={p.images[0]} alt={p.name} className="w-8 h-10 object-cover" />
                        <div>
                          <span className="font-medium text-neutral-900">{p.name}</span>
                          <span className="text-neutral-400 ml-2">({p.sku})</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold">
                          Còn lại: {p.stock}
                        </span>
                        <button
                          onClick={() => handleOpenStockModal(p)}
                          className="px-3 py-1 bg-black text-white text-[10px] uppercase font-semibold cursor-pointer"
                        >
                          Điều chỉnh kho
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PRODUCTS CRUD */}
        {activeTab === 'products' && (
          <div className="bg-white border border-neutral-200 p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
              <div className="flex items-center gap-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-900">
                  Danh sách sản phẩm ({filteredProducts.length})
                </h3>
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="border border-neutral-300 px-2 py-1 text-xs bg-neutral-50"
                >
                  <option value="all">Tất cả danh mục</option>
                  {CATEGORY_LIST.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => handleOpenProductModal()}
                className="px-4 py-2 bg-[#111111] text-white hover:bg-black text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm sản phẩm mới</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs font-sans-clean text-left">
                <thead className="bg-neutral-50 text-neutral-600 uppercase tracking-wider border-b border-neutral-200">
                  <tr>
                    <th className="py-3 px-4">Sản phẩm</th>
                    <th className="py-3 px-4">Danh mục</th>
                    <th className="py-3 px-4">Giá bán</th>
                    <th className="py-3 px-4">Tồn kho</th>
                    <th className="py-3 px-4">Thương hiệu</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img src={prod.images[0]} alt={prod.name} className="w-10 h-12 object-cover bg-neutral-100" />
                        <div>
                          <div className="font-semibold text-neutral-900">{prod.name}</div>
                          <div className="text-[10px] text-neutral-400 font-mono">SKU: {prod.sku}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-neutral-600">{prod.category}</td>
                      <td className="py-3 px-4 font-semibold text-neutral-900">{formatVND(prod.price)}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleOpenStockModal(prod)}
                          className={`px-2 py-0.5 font-bold cursor-pointer hover:underline ${
                            prod.stock <= 5 ? 'bg-amber-100 text-amber-800' : 'bg-neutral-100 text-neutral-800'
                          }`}
                        >
                          {prod.stock} cái
                        </button>
                      </td>
                      <td className="py-3 px-4 text-neutral-600">{prod.brand || 'CM Official'}</td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenProductModal(prod)}
                          className="p-1.5 hover:bg-neutral-200 rounded text-neutral-700 cursor-pointer"
                          title="Sửa sản phẩm"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id, prod.name)}
                          className="p-1.5 hover:bg-rose-100 rounded text-rose-600 cursor-pointer"
                          title="Xóa sản phẩm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="bg-white border border-neutral-200 p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-900">
                Toàn bộ đơn hàng ({orders.length})
              </h3>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-neutral-500">Lọc theo trạng thái:</span>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="border border-neutral-300 px-2 py-1 bg-neutral-50"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="pending">Chờ xử lý (Pending)</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="processing">Đang chuẩn bị hàng</option>
                  <option value="shipping">Đang giao hàng</option>
                  <option value="delivered">Đã giao thành công</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs font-sans-clean text-left">
                <thead className="bg-neutral-50 text-neutral-600 uppercase tracking-wider border-b border-neutral-200">
                  <tr>
                    <th className="py-3 px-4">Mã đơn</th>
                    <th className="py-3 px-4">Khách hàng</th>
                    <th className="py-3 px-4">Tổng thanh toán</th>
                    <th className="py-3 px-4">Thanh toán</th>
                    <th className="py-3 px-4">Trạng thái vận đơn</th>
                    <th className="py-3 px-4 text-right">Chi tiết</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-neutral-900">
                        #{order.id}
                        <div className="text-[10px] font-normal text-neutral-400 font-sans-clean">
                          {formatDate(order.createdAt)}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-neutral-900">{order.customer.fullName}</div>
                        <div className="text-neutral-500 text-[11px]">{order.customer.phoneNumber}</div>
                        <div className="text-neutral-400 text-[10px] truncate max-w-xs">
                          {order.customer.streetAddress}, {order.customer.province}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-black">{formatVND(order.totalAmount)}</td>
                      <td className="py-3 px-4">
                        <select
                          value={order.paymentStatus}
                          onChange={(e) => handleUpdatePaymentStatus(order.id, e.target.value as PaymentStatus)}
                          className={`px-2 py-1 text-[10px] font-bold uppercase rounded border cursor-pointer ${
                            order.paymentStatus === 'paid'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-amber-50 text-amber-800 border-amber-300'
                          }`}
                        >
                          <option value="unpaid">Chưa thanh toán</option>
                          <option value="paid">Đã thanh toán</option>
                          <option value="refunded">Hoàn tiền</option>
                          <option value="failed">Thất bại</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className="bg-neutral-50 border border-neutral-300 px-2 py-1 text-[11px] font-medium uppercase text-neutral-800 cursor-pointer"
                        >
                          <option value="pending">Chờ xử lý</option>
                          <option value="confirmed">Đã xác nhận</option>
                          <option value="processing">Đang chuẩn bị</option>
                          <option value="shipping">Đang giao</option>
                          <option value="delivered">Đã giao</option>
                          <option value="cancelled">Đã hủy</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onNavigate(`/order-success/${order.id}`)}
                          className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 uppercase font-semibold text-[10px] cursor-pointer"
                        >
                          Xem đơn
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: COUPONS */}
        {activeTab === 'coupons' && (
          <div className="bg-white border border-neutral-200 p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-900">
                Quản lý mã ưu đãi ({coupons.length})
              </h3>
              <button
                onClick={() => setIsCouponModalOpen(true)}
                className="px-4 py-2 bg-black text-white text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tạo mã mới</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {coupons.map((c) => (
                <div key={c.code} className="border border-neutral-200 p-4 bg-neutral-50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono font-bold text-sm bg-black text-white px-2 py-0.5">
                        {c.code}
                      </span>
                      <button
                        onClick={() => toggleCouponStatus(c.code)}
                        className={`text-[10px] font-semibold uppercase px-2 py-0.5 border cursor-pointer ${
                          c.isActive ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-neutral-200 text-neutral-600 border-neutral-300'
                        }`}
                      >
                        {c.isActive ? 'Hoạt động' : 'Tạm dừng'}
                      </button>
                    </div>
                    <p className="text-xs text-neutral-700 font-medium">{c.description}</p>
                    <p className="text-[11px] text-neutral-500 mt-1">
                      Giảm:{' '}
                      <strong>{c.discountType === 'percentage' ? `${c.discountValue}%` : formatVND(c.discountValue)}</strong>
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      Đơn tối thiểu: {formatVND(c.minimumOrder)}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-neutral-200 flex justify-between items-center text-[10px] text-neutral-400">
                    <span>Đã dùng: {c.usageCount} lượt</span>
                    <button
                      onClick={() => deleteCoupon(c.code)}
                      className="text-rose-600 hover:underline cursor-pointer font-semibold"
                    >
                      Xóa mã
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: INVENTORY LOGS */}
        {activeTab === 'inventory' && (
          <div className="bg-white border border-neutral-200 p-6 space-y-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 pb-4 border-b border-neutral-200 flex items-center gap-2">
              <History className="w-4 h-4" />
              <span>Nhật ký biến động tồn kho (Authoritative Audit Trail)</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs font-sans-clean text-left">
                <thead className="bg-neutral-50 text-neutral-600 uppercase tracking-wider border-b border-neutral-200">
                  <tr>
                    <th className="py-3 px-4">Thời gian</th>
                    <th className="py-3 px-4">Sản phẩm</th>
                    <th className="py-3 px-4">Biến động</th>
                    <th className="py-3 px-4">Tồn trước</th>
                    <th className="py-3 px-4">Tồn sau</th>
                    <th className="py-3 px-4">Lý do</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {inventoryLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-neutral-50/60">
                      <td className="py-3 px-4 text-neutral-400 font-mono">{formatDate(log.createdAt)}</td>
                      <td className="py-3 px-4 font-semibold text-neutral-900">{log.productName}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-bold ${
                            log.changeAmount < 0 ? 'text-rose-600' : 'text-emerald-600'
                          }`}
                        >
                          {log.changeAmount > 0 ? `+${log.changeAmount}` : log.changeAmount}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-neutral-500">{log.previousStock}</td>
                      <td className="py-3 px-4 font-bold text-neutral-900">{log.newStock}</td>
                      <td className="py-3 px-4 text-neutral-600">
                        {log.reason} {log.orderId && <span className="font-mono">(Đơn #{log.orderId})</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: REVIEWS MODERATION */}
        {activeTab === 'reviews' && (
          <div className="bg-white border border-neutral-200 p-6 space-y-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 pb-4 border-b border-neutral-200">
              Kiểm duyệt đánh giá của khách hàng ({reviewsList.length})
            </h3>

            <div className="divide-y divide-neutral-100 text-xs font-sans-clean">
              {reviewsList.map((rev) => (
                <div key={rev.id} className="py-4 flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-neutral-900">{rev.userName}</span>
                      <span className="text-amber-500">{'★'.repeat(rev.rating)}</span>
                      <span className="text-neutral-400 text-[10px]">{formatDate(rev.createdAt)}</span>
                      <span className="text-[10px] bg-neutral-100 text-neutral-600 px-1.5 py-0.5">
                        Product: {rev.productId}
                      </span>
                    </div>
                    <p className="text-neutral-700 italic">"{rev.comment}"</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleReviewStatus(rev.id, rev.status)}
                      className={`px-3 py-1 text-[10px] uppercase font-semibold rounded cursor-pointer ${
                        rev.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-neutral-200 text-neutral-700'
                      }`}
                    >
                      {rev.status === 'active' ? 'Hiển thị' : 'Đang ẩn'}
                    </button>
                    <button
                      onClick={() => handleDeleteReview(rev.id)}
                      className="p-1 text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: SETTINGS & DATA MODES */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            <div className="bg-white border border-neutral-200 p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">
                    Chế độ vận hành cửa hàng & Dữ liệu
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Dễ dàng chuyển đổi giữa dữ liệu demo để duyệt giao diện hoặc làm sạch để bắt đầu kinh doanh thật.
                  </p>
                </div>
                <Database className="w-6 h-6 text-neutral-700" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-emerald-300 bg-emerald-50/50 p-6 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-2 py-0.5">
                      Chế độ Bán Hàng Thật (Clean Production)
                    </span>
                    <h4 className="font-serif-luxury text-lg font-medium text-neutral-900 mt-2">
                      Làm sạch dữ liệu Demo
                    </h4>
                    <p className="text-xs text-neutral-600 mt-1">
                      Xóa toàn bộ sản phẩm mẫu demo, giữ lại cấu trúc và tài khoản admin để bạn tự tay đăng sản phẩm của thương hiệu CM.
                    </p>
                  </div>
                  <button
                    onClick={() => handleSwitchDataMode('clean')}
                    className="mt-6 w-full py-2.5 bg-emerald-800 text-white hover:bg-emerald-900 text-xs font-semibold uppercase tracking-wider cursor-pointer"
                  >
                    Kích hoạt Chế độ Bán Thật
                  </button>
                </div>

                <div className="border border-neutral-300 bg-white p-6 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-600 bg-neutral-100 px-2 py-0.5">
                      Dữ liệu mẫu (Demo Catalog)
                    </span>
                    <h4 className="font-serif-luxury text-lg font-medium text-neutral-900 mt-2">
                      Nạp lại Catalog Demo
                    </h4>
                    <p className="text-xs text-neutral-600 mt-1">
                      Nạp 6 sản phẩm mẫu phong cách Luxury cao cấp với đầy đủ hình ảnh, thông số kỹ thuật và mã giảm giá.
                    </p>
                  </div>
                  <button
                    onClick={() => handleSwitchDataMode('demo')}
                    className="mt-6 w-full py-2.5 bg-neutral-900 text-white hover:bg-black text-xs font-semibold uppercase tracking-wider cursor-pointer"
                  >
                    Nạp lại dữ liệu Demo
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Edit / Create Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-3xl bg-white border border-neutral-300 p-6 sm:p-8 shadow-2xl relative my-8">
            <button
              onClick={() => setIsProductModalOpen(false)}
              className="absolute top-5 right-5 p-1 text-neutral-400 hover:text-black cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif-luxury text-2xl font-medium text-neutral-900 mb-6">
              {editingProduct ? 'Chỉnh sửa thông tin sản phẩm' : 'Thêm sản phẩm mới'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase text-neutral-700 mb-1">Tên sản phẩm *</label>
                  <input
                    type="text"
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    required
                    placeholder="Ví dụ: Áo Sơ Mi Lụa CM Bespoke"
                    className="w-full border border-neutral-300 p-2.5 focus:border-black outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-neutral-700 mb-1">Danh mục *</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value as ProductCategory)}
                    className="w-full border border-neutral-300 p-2.5 focus:border-black outline-none bg-white"
                  >
                    {CATEGORY_LIST.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold uppercase text-neutral-700 mb-1">Giá bán (VND) *</label>
                  <input
                    type="number"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    required
                    className="w-full border border-neutral-300 p-2.5 focus:border-black outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-neutral-700 mb-1">Giá niêm yết gốc (VND)</label>
                  <input
                    type="number"
                    value={prodOriginalPrice}
                    onChange={(e) => setProdOriginalPrice(Number(e.target.value))}
                    className="w-full border border-neutral-300 p-2.5 focus:border-black outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-neutral-700 mb-1">Số lượng tồn kho *</label>
                  <input
                    type="number"
                    value={prodStock}
                    onChange={(e) => setProdStock(Number(e.target.value))}
                    required
                    className="w-full border border-neutral-300 p-2.5 focus:border-black outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold uppercase text-neutral-700 mb-1">Mã SKU *</label>
                  <input
                    type="text"
                    value={prodSku}
                    onChange={(e) => setProdSku(e.target.value)}
                    required
                    className="w-full border border-neutral-300 p-2.5 focus:border-black outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-neutral-700 mb-1">Chất liệu</label>
                  <input
                    type="text"
                    value={prodMaterial}
                    onChange={(e) => setProdMaterial(e.target.value)}
                    placeholder="Lụa Mulberry, Da Ý..."
                    className="w-full border border-neutral-300 p-2.5 focus:border-black outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-neutral-700 mb-1">Xuất xứ</label>
                  <input
                    type="text"
                    value={prodOrigin}
                    onChange={(e) => setProdOrigin(e.target.value)}
                    placeholder="Việt Nam, Ý, Nhật Bản..."
                    className="w-full border border-neutral-300 p-2.5 focus:border-black outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase text-neutral-700 mb-1">Link hình ảnh đại diện (URL) *</label>
                <input
                  type="url"
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  required
                  className="w-full border border-neutral-300 p-2.5 focus:border-black outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-neutral-700 mb-1">Mô tả ngắn</label>
                <textarea
                  rows={2}
                  value={prodShortDesc}
                  onChange={(e) => setProdShortDesc(e.target.value)}
                  className="w-full border border-neutral-300 p-2.5 focus:border-black outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-neutral-700 mb-1">Mô tả chi tiết sản phẩm</label>
                <textarea
                  rows={4}
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  className="w-full border border-neutral-300 p-2.5 focus:border-black outline-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 border border-neutral-300 text-xs font-semibold uppercase cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-7 py-2.5 bg-black text-white text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-neutral-800"
                >
                  Lưu vào hệ thống
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {isStockModalOpen && selectedStockProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-neutral-300 p-6 shadow-2xl relative">
            <button
              onClick={() => setIsStockModalOpen(false)}
              className="absolute top-5 right-5 p-1 text-neutral-400 hover:text-black cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif-luxury text-xl font-medium text-neutral-900 mb-2">
              Điều chỉnh tồn kho
            </h3>
            <p className="text-xs text-neutral-500 mb-4 font-sans-clean">
              Sản phẩm: <strong>{selectedStockProduct.name}</strong> ({selectedStockProduct.sku})
            </p>

            <form onSubmit={handleSaveStockAdjustment} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase text-neutral-700 mb-1">
                  Số lượng tồn mới *
                </label>
                <input
                  type="number"
                  min="0"
                  value={stockAdjustVal}
                  onChange={(e) => setStockAdjustVal(Number(e.target.value))}
                  required
                  className="w-full border border-neutral-300 p-2.5 text-sm font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-neutral-700 mb-1">
                  Lý do điều chỉnh *
                </label>
                <input
                  type="text"
                  value={stockAdjustReason}
                  onChange={(e) => setStockAdjustReason(e.target.value)}
                  required
                  placeholder="Nhập kho bổ sung, kiểm kê định kỳ..."
                  className="w-full border border-neutral-300 p-2.5"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsStockModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 text-xs font-semibold uppercase"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-black text-white text-xs font-semibold uppercase"
                >
                  Xác nhận kho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Coupon Modal */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-neutral-300 p-6 shadow-2xl relative">
            <button
              onClick={() => setIsCouponModalOpen(false)}
              className="absolute top-5 right-5 p-1 text-neutral-400 hover:text-black cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif-luxury text-xl font-medium text-neutral-900 mb-4">
              Tạo mã giảm giá mới
            </h3>
            <form onSubmit={handleSaveCoupon} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase text-neutral-700 mb-1">Mã Code *</label>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="CMVIP20"
                  required
                  className="w-full border border-neutral-300 p-2.5 uppercase font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase text-neutral-700 mb-1">Loại giảm giá</label>
                  <select
                    value={couponType}
                    onChange={(e) => setCouponType(e.target.value as any)}
                    className="w-full border border-neutral-300 p-2.5 bg-white"
                  >
                    <option value="percentage">Phần trăm (%)</option>
                    <option value="fixed">Số tiền cố định (₫)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold uppercase text-neutral-700 mb-1">Giá trị giảm *</label>
                  <input
                    type="number"
                    value={couponValue}
                    onChange={(e) => setCouponValue(Number(e.target.value))}
                    required
                    className="w-full border border-neutral-300 p-2.5"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase text-neutral-700 mb-1">Đơn tối thiểu (₫)</label>
                  <input
                    type="number"
                    value={couponMinOrder}
                    onChange={(e) => setCouponMinOrder(Number(e.target.value))}
                    className="w-full border border-neutral-300 p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-neutral-700 mb-1">Giảm tối đa (₫)</label>
                  <input
                    type="number"
                    value={couponMaxDiscount}
                    onChange={(e) => setCouponMaxDiscount(Number(e.target.value))}
                    placeholder="0 là không giới hạn"
                    className="w-full border border-neutral-300 p-2.5"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 text-xs font-semibold uppercase"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-black text-white text-xs font-semibold uppercase"
                >
                  Tạo mã
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
