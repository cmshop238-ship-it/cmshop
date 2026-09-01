export type ProductCategory = 
  | 'Thời trang'
  | 'Giày'
  | 'Đồng hồ'
  | 'Túi & Ví'
  | 'Công nghệ'
  | 'Phụ kiện';

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Size M / Đen" or "Gold / 40mm"
  size?: string;
  color?: string;
  colorHex?: string;
  sku: string;
  price?: number; // Override price if variant differs
  stock: number;
}

export interface ProductReview {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
  verifiedPurchase?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  price: number; // in VND
  originalPrice?: number; // for sale calculations
  isNew?: boolean;
  isFeatured?: boolean;
  rating: number;
  reviewCount: number;
  stock: number; // Total stock
  sku: string;
  images: string[];
  description: string;
  shortDescription: string;
  features: string[];
  specifications: Record<string, string>;
  variants?: ProductVariant[];
  colors?: { name: string; hex: string }[];
  sizes?: string[];
  reviews: ProductReview[];
  brand?: string;
  material?: string;
  origin?: string;
}

export interface CartItem {
  id: string; // Unique cart item ID (combines product id + selected variants)
  productId: string;
  product: Product;
  selectedVariant?: ProductVariant;
  selectedColor?: string;
  selectedSize?: string;
  quantity: number;
  unitPrice: number;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // e.g., 10 for 10% or 100000 for 100.000₫
  minimumOrder: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  description: string;
}

export type OrderStatus = 
  | 'pending'      // Chờ xử lý
  | 'confirmed'    // Đã xác nhận
  | 'processing'   // Đang chuẩn bị hàng
  | 'shipping'     // Đang giao hàng
  | 'delivered'    // Đã giao hàng
  | 'cancelled';   // Đã hủy

export type PaymentMethod = 
  | 'cod'               // Thanh toán khi nhận hàng
  | 'bank_transfer'     // Chuyển khoản ngân hàng (VietQR)
  | 'vnpay'             // Cổng VNPay
  | 'momo'              // Ví MoMo
  | 'zalopay'           // Ví ZaloPay
  | 'credit_card';      // Thẻ quốc tế Visa/MasterCard

export type PaymentStatus = 'unpaid' | 'paid' | 'refunded' | 'failed';

export type ShippingMethod = 'standard' | 'express';

export interface ShippingAddress {
  fullName: string;
  phoneNumber: string;
  email: string;
  province: string;
  district: string;
  ward: string;
  streetAddress: string;
  note?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  sku: string;
  selectedVariantText?: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: string; // e.g. "CM-2026-98124"
  customer: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  shippingMethod: ShippingMethod;
  discountAmount: number;
  appliedCoupon?: string;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
}

export interface UserAddress extends ShippingAddress {
  id: string;
  isDefault?: boolean;
  tag?: 'Nhà riêng' | 'Văn phòng' | 'Khác';
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  avatarUrl?: string;
  role: 'customer' | 'admin';
  addresses: UserAddress[];
  createdAt: string;
}

export interface FilterState {
  searchQuery: string;
  categories: ProductCategory[];
  priceRange: [number, number];
  onlyNew: boolean;
  onlySale: boolean;
  onlyInStock: boolean;
  minRating: number;
  sortBy: 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'best-selling' | 'top-rated';
}
