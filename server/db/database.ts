import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface ProductModel {
  id: string;
  slug: string;
  name: string;
  category: string;
  categoryId?: string;
  price: number;
  originalPrice?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  rating: number;
  reviewCount: number;
  stock: number;
  sku: string;
  images: string[];
  description: string;
  shortDescription: string;
  features?: string[];
  specifications?: Record<string, string>;
  colors?: { name: string; hex: string }[];
  sizes?: string[];
  brand?: string;
  material?: string;
  origin?: string;
  status: 'active' | 'hidden' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export interface CategoryModel {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  displayOrder: number;
}

export interface OrderItemModel {
  productId: string;
  productName: string;
  productImage: string;
  sku: string;
  selectedVariantText?: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface OrderModel {
  id: string; // CM-2026-XXXXX
  customer: {
    fullName: string;
    phoneNumber: string;
    email: string;
    province: string;
    district: string;
    ward: string;
    streetAddress: string;
    note?: string;
  };
  items: OrderItemModel[];
  subtotal: number;
  shippingFee: number;
  shippingMethod: 'standard' | 'express';
  discountAmount: number;
  appliedCoupon?: string;
  totalAmount: number;
  paymentMethod: 'cod' | 'bank_transfer' | 'vnpay' | 'momo' | 'zalopay' | 'credit_card';
  paymentStatus: 'unpaid' | 'paid' | 'refunded' | 'failed';
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipping' | 'delivered' | 'cancelled';
  userId?: string;
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
}

export interface UserModel {
  id: string;
  email: string;
  passwordHash: string;
  salt: string;
  fullName: string;
  phoneNumber?: string;
  avatarUrl?: string;
  role: 'customer' | 'admin';
  addresses: {
    id: string;
    fullName: string;
    phoneNumber: string;
    email: string;
    province: string;
    district: string;
    ward: string;
    streetAddress: string;
    note?: string;
    isDefault?: boolean;
    tag?: 'Nhà riêng' | 'Văn phòng' | 'Khác';
  }[];
  wishlist?: string[]; // Product IDs
  createdAt: string;
}

export interface CouponModel {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minimumOrder: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  description: string;
}

export interface ReviewModel {
  id: string;
  productId: string;
  userId?: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  status: 'active' | 'hidden';
  createdAt: string;
}

export interface InventoryLogModel {
  id: string;
  productId: string;
  productName: string;
  changeAmount: number;
  previousStock: number;
  newStock: number;
  reason: string;
  orderId?: string;
  createdAt: string;
}

export interface StoreSettingsModel {
  storeName: string;
  hotline: string;
  email: string;
  address: string;
  supportHours: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
  bankBin: string;
  standardShippingFee: number;
  expressShippingFee: number;
  freeShippingThreshold: number;
  isDemoData: boolean;
}

export interface DatabaseSchema {
  products: ProductModel[];
  categories: CategoryModel[];
  orders: OrderModel[];
  users: UserModel[];
  coupons: CouponModel[];
  reviews: ReviewModel[];
  inventoryLogs: InventoryLogModel[];
  settings: StoreSettingsModel;
}

const DB_FILE_PATH = path.join(process.cwd(), 'data', 'db.json');

// Default initial data for CM Shop
const INITIAL_CATEGORIES: CategoryModel[] = [
  {
    id: 'cat-1',
    name: 'Thời trang',
    slug: 'thoi-trang',
    description: 'Trang phục may đo cao cấp với chất liệu lụa, dạ len và cotton hữu cơ thượng hạng.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop',
    displayOrder: 1,
  },
  {
    id: 'cat-2',
    name: 'Túi & Ví',
    slug: 'tui-vi',
    description: 'Bộ sưu tập túi xách, bóp ví da thật chế tác thủ công tinh xảo từng đường kim mũi chỉ.',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop',
    displayOrder: 2,
  },
  {
    id: 'cat-3',
    name: 'Đồng hồ',
    slug: 'dong-ho',
    description: 'Tuyệt tác thời gian Thụy Sỹ với mặt kính Sapphire nguyên khối và bộ máy cơ khí chính xác.',
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=800&auto=format&fit=crop',
    displayOrder: 3,
  },
  {
    id: 'cat-4',
    name: 'Giày',
    slug: 'giay',
    description: 'Giày Oxford, Loafer và Sneaker da bê thủ công mang đến trải nghiệm êm ái tối thượng.',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop',
    displayOrder: 4,
  },
  {
    id: 'cat-5',
    name: 'Công nghệ',
    slug: 'cong-nghe',
    description: 'Thiết bị âm thanh audiophile và phụ kiện công nghệ tinh tế bọc da và kim loại nguyên khối.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
    displayOrder: 5,
  },
  {
    id: 'cat-6',
    name: 'Phụ kiện',
    slug: 'phu-kien',
    description: 'Kính râm titan, thắt lưng da Ý và trang sức tối giản hoàn thiện phong cách thượng lưu.',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop',
    displayOrder: 6,
  },
];

const INITIAL_PRODUCTS: ProductModel[] = [
  {
    id: 'cm-prod-001',
    slug: 'ao-blazer-da-wool-heritage-black',
    name: 'Áo Blazer Dạ Wool Heritage Black',
    category: 'Thời trang',
    categoryId: 'cat-1',
    price: 4850000,
    originalPrice: 5600000,
    isNew: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 28,
    stock: 15,
    sku: 'CM-BLZ-001-BLK',
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?q=80&w=1000&auto=format&fit=crop',
    ],
    shortDescription: 'Áo khoác Blazer may đo thủ công từ 100% sợi len lông cừu Merino nhập khẩu từ Ý.',
    description: 'Mẫu áo Blazer Heritage Black của CM đại diện cho sự sang trọng vĩnh cửu. Sử dụng chất liệu vải len lông cừu Merino 100% mềm mịn, đứng form hoàn hảo cùng lớp lót lụa Cupro thoáng khí. Từng đường khâu thủ công bởi nghệ nhân may đo hàng đầu.',
    features: [
      '100% Lông cừu Merino Ý dệt chéo siêu mịn',
      'Lớp lót lụa Bemberg Cupro cao cấp chống tĩnh điện',
      'Cúc áo chế tác từ sừng trâu tự nhiên dập chìm biểu tượng CM',
      'Form dáng Modern Tailored tôn vinh vóc dáng',
    ],
    specifications: {
      'Chất liệu': '100% Wool Merino Ý',
      'Lớp lót': '100% Cupro Silk',
      'Xuất xứ': 'Việt Nam (Nghệ nhân may đo CM)',
      'Bảo quản': 'Giặt khô chuyên nghiệp',
    },
    colors: [
      { name: 'Heritage Black', hex: '#1A1A1A' },
      { name: 'Midnight Navy', hex: '#1B2430' },
      { name: 'Charcoal Grey', hex: '#363636' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    brand: 'CM Official',
    material: '100% Merino Wool',
    origin: 'Ý / May thủ công tại Việt Nam',
    status: 'active',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'cm-prod-002',
    slug: 'tui-xach-da-bo-y-le-grand-tote',
    name: 'Túi Xách Da Bò Ý Le Grand Tote',
    category: 'Túi & Ví',
    categoryId: 'cat-2',
    price: 8900000,
    originalPrice: 9800000,
    isNew: false,
    isFeatured: true,
    rating: 5.0,
    reviewCount: 42,
    stock: 8,
    sku: 'CM-BAG-002-TAN',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1000&auto=format&fit=crop',
    ],
    shortDescription: 'Túi Tote da bò Full-Grain nhập khẩu vùng Tuscany nước Ý, khóa mạ vàng 18K mờ.',
    description: 'Le Grand Tote là sự kết hợp hoàn mỹ giữa tính thực dụng hàng ngày và vẻ đẹp thẩm mỹ xa xỉ. Da bò nguyên tấm thuộc thảo mộc tự nhiên theo thời gian sẽ tạo nên lớp patina bóng đẹp độc bản.',
    features: [
      'Da bò Full-Grain Tuscany thuộc thảo mộc tự nhiên',
      'Chi tiết kim loại mạ vàng 18K mờ chống xước',
      'Ngăn chứa đệm nhung êm ái vừa vặn laptop 15.6 inch',
      'Quai xách chịu lực may viền chỉ sáp gia cố đôi',
    ],
    specifications: {
      'Chất liệu': 'Da bò Full Grain Ý (Vegetable Tanned)',
      'Kích thước': '38cm x 29cm x 14cm',
      'Phụ kiện': 'Khóa kim loại mạ vàng 18K',
      'Bảo hành': 'Bảo hành da trọn đời tại CM',
    },
    colors: [
      { name: 'Cognac Brown', hex: '#8B4513' },
      { name: 'Obsidian Black', hex: '#111111' },
      { name: 'Alabaster Cream', hex: '#F3EFE0' },
    ],
    sizes: ['One Size'],
    brand: 'CM Leather Goods',
    material: 'Da bò Full-Grain',
    origin: 'Tuscany, Ý',
    status: 'active',
    createdAt: '2026-01-12T10:00:00Z',
    updatedAt: '2026-01-12T10:00:00Z',
  },
  {
    id: 'cm-prod-003',
    slug: 'dong-ho-chronograph-chronos-monolith-automatic',
    name: 'Đồng Hồ Cơ Chronos Monolith Automatic',
    category: 'Đồng hồ',
    categoryId: 'cat-3',
    price: 15600000,
    originalPrice: 17500000,
    isNew: true,
    isFeatured: true,
    rating: 4.95,
    reviewCount: 19,
    stock: 5,
    sku: 'CM-WAT-003-SLV',
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=1000&auto=format&fit=crop',
    ],
    shortDescription: 'Cỗ máy thời gian tự động Thụy Sỹ trữ cót 42h, kính sapphire phủ chống lóa kép.',
    description: 'Chronos Monolith Automatic sở hữu vỏ thép không gỉ 316L đánh bóng kết hợp phay xước viền sắc sảo. Mặt số đen tuyền hiển thị 3 đồng hồ phụ Chronograph với kim sơn dạ quang Super-LumiNova Thụy Sỹ.',
    features: [
      'Bộ máy cơ tự động Swiss Automatic Calibre CM-88',
      'Mặt kính Sapphire nguyên khối vát cạnh chống phản quang',
      'Chống nước độ sâu 10 ATM (100 Mét)',
      'Dây da cá sấu Alligator Nam Mỹ khóa bấm bướm chống gãy',
    ],
    specifications: {
      'Đường kính mặt': '40 mm',
      'Độ dày vỏ': '11.5 mm',
      'Chất liệu vỏ': 'Thép không gỉ 316L',
      'Bộ máy': 'Swiss Automatic (28,800 vph)',
    },
    colors: [
      { name: 'Silver Noir', hex: '#C0C0C0' },
      { name: 'Rose Gold', hex: '#B76E79' },
    ],
    sizes: ['40mm'],
    brand: 'CM Horology',
    material: 'Thép 316L & Kính Sapphire',
    origin: 'Thụy Sỹ (Swiss Made Components)',
    status: 'active',
    createdAt: '2026-01-14T10:00:00Z',
    updatedAt: '2026-01-14T10:00:00Z',
  },
  {
    id: 'cm-prod-004',
    slug: 'giay-loafer-da-be-handmade-venice',
    name: 'Giày Loafer Da Bê Handmade Venice',
    category: 'Giày',
    categoryId: 'cat-4',
    price: 3650000,
    originalPrice: 4200000,
    isNew: false,
    isFeatured: true,
    rating: 4.85,
    reviewCount: 35,
    stock: 12,
    sku: 'CM-SH-004-BRN',
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1000&auto=format&fit=crop',
    ],
    shortDescription: 'Giày Loafer cấu trúc may đế Goodyear Welted siêu bền, da bê Pháp dẻo dai.',
    description: 'Được chế tác theo phương pháp đóng giày thủ công truyền thống của Venice. Cấu trúc đế Goodyear Welted cho phép thay đế dễ dàng và khả năng kháng nước tuyệt đối, tạo nên sự êm ái linh hoạt.',
    features: [
      'Da bê đực Pháp nguyên miếng thuộc dầu tự nhiên',
      'Cấu trúc đế Goodyear Welted chuẩn giày âu cao cấp',
      'Lót trong bằng da cừu mộc hút ẩm thoáng khí',
      'Miếng đệm memory foam gót chân chống mỏi',
    ],
    specifications: {
      'Chất liệu da': 'Box Calf Leather Pháp',
      'Đế giày': 'Da thuộc nhiều lớp ép gỗ sồi',
      'Kiểu dáng': 'Penny Loafer Cổ điển',
      'Kích cỡ': '39, 40, 41, 42, 43, 44',
    },
    colors: [
      { name: 'Espresso Brown', hex: '#3E2723' },
      { name: 'Midnight Black', hex: '#111111' },
    ],
    sizes: ['39', '40', '41', '42', '43', '44'],
    brand: 'CM Shoemaker',
    material: 'Da bê Box Calf',
    origin: 'Việt Nam & Ý',
    status: 'active',
    createdAt: '2026-01-16T10:00:00Z',
    updatedAt: '2026-01-16T10:00:00Z',
  },
  {
    id: 'cm-prod-005',
    slug: 'tai-nghe-audiophile-khong-day-cm-acoustic-one',
    name: 'Tai Nghe Audiophile Không Dây CM Acoustic One',
    category: 'Công nghệ',
    categoryId: 'cat-5',
    price: 7450000,
    originalPrice: 8200000,
    isNew: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 22,
    stock: 10,
    sku: 'CM-TECH-005-SLV',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1000&auto=format&fit=crop',
    ],
    shortDescription: 'Tai nghe chụp tai Over-Ear nhôm phay xước, màng loa Beryllium 40mm âm thanh Hi-Res.',
    description: 'CM Acoustic One là giao điểm hoàn hảo giữa kỹ thuật cơ khí chính xác và nghệ thuật âm thanh Hi-End. Vỏ bọc da cừu mềm mại cùng khung nhôm máy bay siêu nhẹ mang đến cảm giác đeo êm ái hàng giờ liền.',
    features: [
      'Driver Dynamic Beryllium 40mm tinh chỉnh âm thanh phòng thu',
      'Chống ồn chủ động Hybrid ANC thích ứng 4 micro',
      'Thời lượng pin 38 giờ phát nhạc liên tục với cổng Type-C sạc nhanh',
      'Hỗ trợ codec LDAC, aptX Adaptive và giải mã 24-bit/96kHz',
    ],
    specifications: {
      'Tần số đáp ứng': '10Hz - 45,000Hz',
      'Kết nối': 'Bluetooth 5.3 & Jack 3.5mm mạ vàng',
      'Trọng lượng': '285g',
      'Thời lượng pin': '38 Giờ',
    },
    colors: [
      { name: 'Silver & Saddle Brown', hex: '#8D6E63' },
      { name: 'Matte Titanium Black', hex: '#212121' },
    ],
    sizes: ['One Size'],
    brand: 'CM Audio Labs',
    material: 'Nhôm Hàng Không & Da Cừu',
    origin: 'Nhật Bản & Đức',
    status: 'active',
    createdAt: '2026-01-18T10:00:00Z',
    updatedAt: '2026-01-18T10:00:00Z',
  },
  {
    id: 'cm-prod-006',
    slug: 'kinh-ram-titanium-ma-vang-solaris-aviator',
    name: 'Kính Râm Titanium Mạ Vàng Solaris Aviator',
    category: 'Phụ kiện',
    categoryId: 'cat-6',
    price: 3200000,
    originalPrice: 3800000,
    isNew: false,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 31,
    stock: 20,
    sku: 'CM-ACC-006-GLD',
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1000&auto=format&fit=crop',
    ],
    shortDescription: 'Gọng kính Titanium siêu nhẹ mạ vàng 18K, tròng kính phân cực Polarized chống tia UV 100%.',
    description: 'Dáng kính Aviator kinh điển được CM tái sinh bằng chất liệu Titanium nguyên khối chỉ nặng 14 gram. Tròng kính phân cực Nhật Bản ngăn chặn hoàn toàn chói sáng và phản xạ có hại.',
    features: [
      'Khung gọng hợp kim Titanium nguyên khối siêu nhẹ và đàn hồi',
      'Mạ vàng 18K PVD chống ăn mòn và oxy hóa mồ hôi',
      'Tròng kính phân cực Polarized UV400 chuẩn quang học',
      'Đệm mũi silicone y tế êm ái không để lại vết hằn',
    ],
    specifications: {
      'Kích thước tròng': '58 mm',
      'Cầu kính': '14 mm',
      'Chiều dài càng': '145 mm',
      'Trọng lượng': '14 gram',
    },
    colors: [
      { name: 'Gold & Forest Green', hex: '#D4AF37' },
      { name: 'Gunmetal & Dark Grey', hex: '#424242' },
    ],
    sizes: ['One Size'],
    brand: 'CM Eyewear',
    material: 'Titanium & Tròng Polarized',
    origin: 'Fukui, Nhật Bản',
    status: 'active',
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-01-20T10:00:00Z',
  },
];

const INITIAL_COUPONS: CouponModel[] = [
  {
    code: 'CMWELCOME',
    discountType: 'percentage',
    discountValue: 10,
    minimumOrder: 1000000,
    maxDiscount: 500000,
    startDate: '2026-01-01T00:00:00Z',
    endDate: '2026-12-31T23:59:59Z',
    usageLimit: 1000,
    usageCount: 45,
    isActive: true,
    description: 'Giảm 10% tối đa 500.000₫ cho đơn hàng từ 1.000.000₫ dành cho thành viên mới',
  },
  {
    code: 'CMLUXURY200',
    discountType: 'fixed',
    discountValue: 200000,
    minimumOrder: 3000000,
    startDate: '2026-01-01T00:00:00Z',
    endDate: '2026-12-31T23:59:59Z',
    usageLimit: 500,
    usageCount: 28,
    isActive: true,
    description: 'Giảm trực tiếp 200.000₫ cho đơn hàng từ 3.000.000₫',
  },
  {
    code: 'CMSHIPFREE',
    discountType: 'fixed',
    discountValue: 50000,
    minimumOrder: 2000000,
    startDate: '2026-01-01T00:00:00Z',
    endDate: '2026-12-31T23:59:59Z',
    usageLimit: 2000,
    usageCount: 112,
    isActive: true,
    description: 'Miễn phí giao hàng hỏa tốc trị giá 50.000₫ cho đơn từ 2.000.000₫',
  },
];

const INITIAL_SETTINGS: StoreSettingsModel = {
  storeName: 'CMSHOP - CM Luxury & Quality Products',
  hotline: '0798417602',
  email: 'cmshop238@gmail.com',
  address: 'Số 68 Đường Đồng Khởi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
  supportHours: '24/7 (Phục vụ 24/24)',
  bankName: 'Ngân hàng TMCP Quân Đội (MB)',
  bankAccountNumber: '0589614334',
  bankAccountName: 'PHAM QUANG THANH',
  bankBin: '970422', // MB Bank BIN code
  standardShippingFee: 30000,
  expressShippingFee: 50000,
  freeShippingThreshold: 2000000,
  isDemoData: true,
};

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

// Initial Admin and Customer account
const adminSalt = crypto.randomBytes(16).toString('hex');
const customerSalt = crypto.randomBytes(16).toString('hex');

const INITIAL_USERS: UserModel[] = [
  {
    id: 'usr-admin-001',
    email: 'admin@cmshop.online',
    passwordHash: hashPassword('CMAdmin@2026!Secure', adminSalt),
    salt: adminSalt,
    fullName: 'Quản Trị Viên CM',
    phoneNumber: '0901234567',
    role: 'admin',
    addresses: [
      {
        id: 'addr-admin-1',
        fullName: 'Quản Trị Viên CM',
        phoneNumber: '0901234567',
        email: 'admin@cmshop.online',
        province: 'TP. Hồ Chí Minh',
        district: 'Quận 1',
        ward: 'Phường Bến Nghé',
        streetAddress: 'Showroom CM Luxury, 88 Đồng Khởi',
        isDefault: true,
        tag: 'Văn phòng',
      },
    ],
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'usr-customer-001',
    email: 'khachhang@cmshop.online',
    passwordHash: hashPassword('KhachHang@2026!', customerSalt),
    salt: customerSalt,
    fullName: 'Phạm Quang Thành',
    phoneNumber: '0909888777',
    role: 'customer',
    addresses: [
      {
        id: 'addr-cust-1',
        fullName: 'Phạm Quang Thành',
        phoneNumber: '0909888777',
        email: 'khachhang@cmshop.online',
        province: 'TP. Hồ Chí Minh',
        district: 'Quận 1',
        ward: 'Phường Bến Nghé',
        streetAddress: 'Số 88 Đường Đồng Khởi, Tòa nhà Times Square',
        note: 'Giao giờ hành chính, gọi trước khi giao',
        isDefault: true,
        tag: 'Văn phòng',
      },
    ],
    createdAt: '2026-01-15T08:00:00Z',
  },
];

class DatabaseEngine {
  private data: DatabaseSchema;
  private isLoaded = false;
  private lockPromise: Promise<void> = Promise.resolve();

  constructor() {
    this.data = {
      products: [],
      categories: [],
      orders: [],
      users: [],
      coupons: [],
      reviews: [],
      inventoryLogs: [],
      settings: INITIAL_SETTINGS,
    };
    this.init();
  }

  private init() {
    try {
      const dataDir = path.dirname(DB_FILE_PATH);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      if (fs.existsSync(DB_FILE_PATH)) {
        const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        this.data = {
          products: parsed.products || INITIAL_PRODUCTS,
          categories: parsed.categories || INITIAL_CATEGORIES,
          orders: parsed.orders || [],
          users: parsed.users || INITIAL_USERS,
          coupons: parsed.coupons || INITIAL_COUPONS,
          reviews: parsed.reviews || [],
          inventoryLogs: parsed.inventoryLogs || [],
          settings: parsed.settings || INITIAL_SETTINGS,
        };
      } else {
        this.data = {
          products: INITIAL_PRODUCTS,
          categories: INITIAL_CATEGORIES,
          orders: [],
          users: INITIAL_USERS,
          coupons: INITIAL_COUPONS,
          reviews: [],
          inventoryLogs: [],
          settings: INITIAL_SETTINGS,
        };
        this.save();
      }
      this.isLoaded = true;
    } catch (err) {
      console.error('Error initializing database:', err);
      this.data = {
        products: INITIAL_PRODUCTS,
        categories: INITIAL_CATEGORIES,
        orders: [],
        users: INITIAL_USERS,
        coupons: INITIAL_COUPONS,
        reviews: [],
        inventoryLogs: [],
        settings: INITIAL_SETTINGS,
      };
    }
  }

  private save(): void {
    try {
      const dataDir = path.dirname(DB_FILE_PATH);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error writing to database:', err);
    }
  }

  /**
   * Acquire atomic lock for transaction safety
   */
  async withLock<T>(fn: () => Promise<T> | T): Promise<T> {
    const prevLock = this.lockPromise;
    let releaseLock: () => void;
    this.lockPromise = new Promise((resolve) => {
      releaseLock = resolve;
    });

    await prevLock;
    try {
      return await fn();
    } finally {
      releaseLock!();
    }
  }

  // --- PRODUCTS ---
  getProducts(filter?: { category?: string; status?: string; search?: string }): ProductModel[] {
    let list = [...this.data.products];
    if (filter?.status) {
      list = list.filter((p) => p.status === filter.status);
    } else {
      // By default, return active
      list = list.filter((p) => p.status === 'active');
    }

    if (filter?.category && filter.category !== 'all') {
      list = list.filter((p) => p.category.toLowerCase() === filter.category?.toLowerCase() || p.categoryId === filter.category);
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    return list;
  }

  getAllProductsAdmin(): ProductModel[] {
    return [...this.data.products];
  }

  getProductById(id: string): ProductModel | undefined {
    return this.data.products.find((p) => p.id === id);
  }

  getProductBySlug(slug: string): ProductModel | undefined {
    return this.data.products.find((p) => p.slug === slug);
  }

  createProduct(productData: Omit<ProductModel, 'id' | 'createdAt' | 'updatedAt'>): ProductModel {
    const newProduct: ProductModel = {
      ...productData,
      id: `cm-prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.products.unshift(newProduct);
    this.save();
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<ProductModel>): ProductModel | undefined {
    const index = this.data.products.findIndex((p) => p.id === id);
    if (index === -1) return undefined;

    const current = this.data.products[index];
    const updated: ProductModel = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.data.products[index] = updated;
    this.save();
    return updated;
  }

  deleteProduct(id: string): boolean {
    const index = this.data.products.findIndex((p) => p.id === id);
    if (index === -1) return false;
    this.data.products.splice(index, 1);
    this.save();
    return true;
  }

  // --- CATEGORIES ---
  getCategories(): CategoryModel[] {
    return [...this.data.categories].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  createCategory(categoryData: Omit<CategoryModel, 'id'>): CategoryModel {
    const newCat: CategoryModel = {
      ...categoryData,
      id: `cat-${Date.now()}`,
    };
    this.data.categories.push(newCat);
    this.save();
    return newCat;
  }

  updateCategory(id: string, updates: Partial<CategoryModel>): CategoryModel | undefined {
    const index = this.data.categories.findIndex((c) => c.id === id);
    if (index === -1) return undefined;
    this.data.categories[index] = { ...this.data.categories[index], ...updates };
    this.save();
    return this.data.categories[index];
  }

  deleteCategory(id: string): boolean {
    const index = this.data.categories.findIndex((c) => c.id === id);
    if (index === -1) return false;
    this.data.categories.splice(index, 1);
    this.save();
    return true;
  }

  // --- ORDERS & TRANSACTIONS (ATOMIC) ---
  async createOrderAtomic(payload: {
    customer: OrderModel['customer'];
    items: { productId: string; quantity: number; selectedVariantText?: string }[];
    shippingMethod: 'standard' | 'express';
    paymentMethod: OrderModel['paymentMethod'];
    couponCode?: string;
    userId?: string;
  }): Promise<OrderModel> {
    return this.withLock(async () => {
      // 1. Fetch live product prices & check stock
      let subtotal = 0;
      const orderItems: OrderItemModel[] = [];

      for (const item of payload.items) {
        const product = this.getProductById(item.productId);
        if (!product) {
          throw new Error(`Sản phẩm [ID: ${item.productId}] không tồn tại trong hệ thống.`);
        }
        if (product.status !== 'active') {
          throw new Error(`Sản phẩm "${product.name}" hiện không còn mở bán.`);
        }
        if (product.stock < item.quantity) {
          throw new Error(`Sản phẩm "${product.name}" hiện chỉ còn ${product.stock} sản phẩm trong kho.`);
        }

        const authoritativePrice = product.price; // Taken strictly from DB
        const itemSubtotal = authoritativePrice * item.quantity;
        subtotal += itemSubtotal;

        orderItems.push({
          productId: product.id,
          productName: product.name,
          productImage: product.images[0] || '',
          sku: product.sku,
          selectedVariantText: item.selectedVariantText,
          quantity: item.quantity,
          price: authoritativePrice,
          subtotal: itemSubtotal,
        });
      }

      // 2. Shipping calculation
      let shippingFee = 0;
      if (payload.shippingMethod === 'standard') {
        shippingFee = subtotal >= this.data.settings.freeShippingThreshold ? 0 : this.data.settings.standardShippingFee;
      } else {
        shippingFee = this.data.settings.expressShippingFee;
      }

      // 3. Coupon validation & recalculation
      let discountAmount = 0;
      let appliedCoupon: string | undefined = undefined;

      if (payload.couponCode) {
        const coupon = this.data.coupons.find(
          (c) => c.code.toUpperCase() === payload.couponCode?.toUpperCase() && c.isActive
        );
        if (coupon) {
          const now = new Date();
          const isStarted = new Date(coupon.startDate) <= now;
          const isNotExpired = new Date(coupon.endDate) >= now;
          const hasLimitRemaining = !coupon.usageLimit || coupon.usageCount < coupon.usageLimit;

          if (isStarted && isNotExpired && hasLimitRemaining && subtotal >= coupon.minimumOrder) {
            if (coupon.discountType === 'percentage') {
              discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
              if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
                discountAmount = coupon.maxDiscount;
              }
            } else {
              discountAmount = coupon.discountValue;
            }
            appliedCoupon = coupon.code;
            coupon.usageCount += 1;
          }
        }
      }

      const totalAmount = Math.max(0, subtotal + shippingFee - discountAmount);

      // Unique Order Number format CM-YYYY-XXXXX
      const year = new Date().getFullYear();
      const randomSuffix = Math.floor(10000 + Math.random() * 90000);
      const orderId = `CM-${year}-${randomSuffix}`;

      const newOrder: OrderModel = {
        id: orderId,
        customer: payload.customer,
        items: orderItems,
        subtotal,
        shippingFee,
        shippingMethod: payload.shippingMethod,
        discountAmount,
        appliedCoupon,
        totalAmount,
        paymentMethod: payload.paymentMethod,
        paymentStatus: 'unpaid',
        orderStatus: 'pending',
        userId: payload.userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        trackingNumber: `VNPOST-${Math.floor(1000000 + Math.random() * 9000000)}`,
      };

      // Atomic inventory deduction & audit logging
      for (const item of payload.items) {
        const productIndex = this.data.products.findIndex((p) => p.id === item.productId);
        if (productIndex !== -1) {
          const prod = this.data.products[productIndex];
          const prevStock = prod.stock;
          const newStock = Math.max(0, prevStock - item.quantity);
          prod.stock = newStock;
          prod.updatedAt = new Date().toISOString();

          // Log inventory adjustment
          this.data.inventoryLogs.unshift({
            id: `inv-log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            productId: prod.id,
            productName: prod.name,
            changeAmount: -item.quantity,
            previousStock: prevStock,
            newStock,
            reason: `Khách hàng đặt đơn hàng #${orderId}`,
            orderId: orderId,
            createdAt: new Date().toISOString(),
          });
        }
      }

      this.data.orders.unshift(newOrder);
      this.save();
      return newOrder;
    });
  }

  getOrders(filter?: { userId?: string; status?: string }): OrderModel[] {
    let list = [...this.data.orders];
    if (filter?.userId) {
      list = list.filter((o) => o.userId === filter.userId || o.customer.email === filter.userId);
    }
    if (filter?.status && filter.status !== 'all') {
      list = list.filter((o) => o.orderStatus === filter.status);
    }
    return list;
  }

  getOrderById(id: string): OrderModel | undefined {
    return this.data.orders.find((o) => o.id.toLowerCase() === id.toLowerCase());
  }

  updateOrderStatus(id: string, status: OrderModel['orderStatus']): OrderModel | undefined {
    const order = this.data.orders.find((o) => o.id === id);
    if (!order) return undefined;

    order.orderStatus = status;
    if (status === 'delivered') {
      order.paymentStatus = 'paid';
    }
    order.updatedAt = new Date().toISOString();
    this.save();
    return order;
  }

  updateOrderPaymentStatus(id: string, paymentStatus: OrderModel['paymentStatus']): OrderModel | undefined {
    const order = this.data.orders.find((o) => o.id === id);
    if (!order) return undefined;

    order.paymentStatus = paymentStatus;
    if (paymentStatus === 'paid' && order.orderStatus === 'pending') {
      order.orderStatus = 'confirmed';
    }
    order.updatedAt = new Date().toISOString();
    this.save();
    return order;
  }

  // --- USERS & AUTH ---
  getUserByEmail(email: string): UserModel | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  getUserById(id: string): UserModel | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  createUser(userData: { email: string; passwordPlain: string; fullName: string; phoneNumber?: string; role?: 'customer' | 'admin' }): UserModel {
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(userData.passwordPlain, salt);

    const newUser: UserModel = {
      id: `usr-${Date.now()}`,
      email: userData.email.toLowerCase().trim(),
      passwordHash,
      salt,
      fullName: userData.fullName,
      phoneNumber: userData.phoneNumber,
      role: userData.role || 'customer',
      addresses: [],
      wishlist: [],
      createdAt: new Date().toISOString(),
    };

    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  verifyUserPassword(email: string, passwordPlain: string): UserModel | null {
    const user = this.getUserByEmail(email);
    if (!user) return null;

    const computedHash = hashPassword(passwordPlain, user.salt);
    if (crypto.timingSafeEqual(Buffer.from(computedHash, 'hex'), Buffer.from(user.passwordHash, 'hex'))) {
      return user;
    }
    return null;
  }

  updateUserProfile(userId: string, updates: Partial<Pick<UserModel, 'fullName' | 'phoneNumber' | 'avatarUrl' | 'addresses' | 'wishlist'>>): UserModel | undefined {
    const user = this.getUserById(userId);
    if (!user) return undefined;

    if (updates.fullName !== undefined) user.fullName = updates.fullName;
    if (updates.phoneNumber !== undefined) user.phoneNumber = updates.phoneNumber;
    if (updates.avatarUrl !== undefined) user.avatarUrl = updates.avatarUrl;
    if (updates.addresses !== undefined) user.addresses = updates.addresses;
    if (updates.wishlist !== undefined) user.wishlist = updates.wishlist;

    this.save();
    return user;
  }

  // --- COUPONS ---
  getCoupons(): CouponModel[] {
    return [...this.data.coupons];
  }

  getCouponByCode(code: string): CouponModel | undefined {
    return this.data.coupons.find((c) => c.code.toUpperCase() === code.toUpperCase());
  }

  createCoupon(couponData: CouponModel): CouponModel {
    this.data.coupons.unshift(couponData);
    this.save();
    return couponData;
  }

  updateCoupon(code: string, updates: Partial<CouponModel>): CouponModel | undefined {
    const index = this.data.coupons.findIndex((c) => c.code.toUpperCase() === code.toUpperCase());
    if (index === -1) return undefined;
    this.data.coupons[index] = { ...this.data.coupons[index], ...updates };
    this.save();
    return this.data.coupons[index];
  }

  deleteCoupon(code: string): boolean {
    const index = this.data.coupons.findIndex((c) => c.code.toUpperCase() === code.toUpperCase());
    if (index === -1) return false;
    this.data.coupons.splice(index, 1);
    this.save();
    return true;
  }

  // --- REVIEWS ---
  getReviewsByProductId(productId: string): ReviewModel[] {
    return this.data.reviews.filter((r) => r.productId === productId && r.status === 'active');
  }

  getAllReviewsAdmin(): ReviewModel[] {
    return [...this.data.reviews];
  }

  createReview(reviewData: Omit<ReviewModel, 'id' | 'createdAt'>): ReviewModel {
    const newRev: ReviewModel = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.data.reviews.unshift(newRev);

    // Update product rating stats
    const prod = this.getProductById(reviewData.productId);
    if (prod) {
      const allProdRevs = this.getReviewsByProductId(reviewData.productId);
      const totalScore = allProdRevs.reduce((sum, r) => sum + r.rating, 0) + newRev.rating;
      const count = allProdRevs.length + 1;
      prod.rating = Number((totalScore / count).toFixed(1));
      prod.reviewCount = count;
    }

    this.save();
    return newRev;
  }

  updateReviewStatus(id: string, status: 'active' | 'hidden'): ReviewModel | undefined {
    const rev = this.data.reviews.find((r) => r.id === id);
    if (!rev) return undefined;
    rev.status = status;
    this.save();
    return rev;
  }

  deleteReview(id: string): boolean {
    const index = this.data.reviews.findIndex((r) => r.id === id);
    if (index === -1) return false;
    this.data.reviews.splice(index, 1);
    this.save();
    return true;
  }

  // --- INVENTORY LOGS ---
  getInventoryLogs(): InventoryLogModel[] {
    return [...this.data.inventoryLogs];
  }

  adjustStock(productId: string, newStock: number, reason: string): ProductModel | undefined {
    const prod = this.getProductById(productId);
    if (!prod) return undefined;

    const prev = prod.stock;
    prod.stock = Math.max(0, newStock);
    prod.updatedAt = new Date().toISOString();

    this.data.inventoryLogs.unshift({
      id: `inv-log-${Date.now()}`,
      productId: prod.id,
      productName: prod.name,
      changeAmount: newStock - prev,
      previousStock: prev,
      newStock: prod.stock,
      reason,
      createdAt: new Date().toISOString(),
    });

    this.save();
    return prod;
  }

  // --- SETTINGS ---
  getSettings(): StoreSettingsModel {
    return { ...this.data.settings };
  }

  updateSettings(updates: Partial<StoreSettingsModel>): StoreSettingsModel {
    this.data.settings = { ...this.data.settings, ...updates };
    this.save();
    return this.data.settings;
  }

  // --- DATA MODE (DEMO VS PRODUCTION) ---
  switchDataMode(mode: 'demo' | 'clean'): void {
    if (mode === 'clean') {
      this.data.orders = [];
      this.data.inventoryLogs = [];
      this.data.reviews = [];
      this.data.settings.isDemoData = false;
    } else {
      this.data.products = INITIAL_PRODUCTS;
      this.data.categories = INITIAL_CATEGORIES;
      this.data.coupons = INITIAL_COUPONS;
      this.data.settings.isDemoData = true;
    }
    this.save();
  }

  // --- ANALYTICS ---
  getAnalyticsSummary() {
    const orders = this.data.orders;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.totalAmount : 0), 0);
    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) => o.orderStatus === 'pending' || o.orderStatus === 'confirmed').length;
    const deliveredOrders = orders.filter((o) => o.orderStatus === 'delivered').length;
    const lowStockProducts = this.data.products.filter((p) => p.stock <= 5);

    return {
      totalRevenue,
      totalOrders,
      pendingOrders,
      deliveredOrders,
      lowStockCount: lowStockProducts.length,
      lowStockProducts,
      recentOrders: orders.slice(0, 5),
    };
  }
}

export const db = new DatabaseEngine();
