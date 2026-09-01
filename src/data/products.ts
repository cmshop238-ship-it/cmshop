import { Product } from '../types';

export const DEMO_PRODUCTS: Product[] = [
  {
    id: 'cm-prod-001',
    slug: 'dong-ho-casio-vintage-gold-steel',
    name: 'Casio Vintage Gold & Steel Edition',
    category: 'Đồng hồ',
    price: 1850000,
    originalPrice: 2250000,
    isNew: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 38,
    stock: 15,
    sku: 'CM-WATCH-001',
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?q=80&w=1000&auto=format&fit=crop'
    ],
    shortDescription: 'Đồng hồ điện tử cổ điển với thiết kế mạ vàng satin và thép không gỉ 316L cao cấp.',
    description: 'Phiên bản Casio Vintage tái hiện phong cách retro kinh điển thập niên 80 với độ hoàn thiện kim loại tinh xảo. Vỏ thép mạ PVD vàng mờ chống trầy xước, mặt kính khoáng cường lực và khả năng chống nước chuẩn sinh hoạt 50m. Phụ kiện không thể thiếu cho phong cách tối giản thanh lịch.',
    features: [
      'Chất liệu thép không gỉ 316L mạ ion PVD cao cấp',
      'Độ chịu nước 5ATM (50 mét)',
      'Thời lượng pin lên đến 7 năm',
      'Đèn LED nền màu hổ phách dịu mắt',
      'Bảo hành chính hãng 2 năm tại CM'
    ],
    specifications: {
      'Thương hiệu': 'CM Heritage Selection',
      'Đường kính mặt': '36.8 mm',
      'Độ dày mặt': '8.6 mm',
      'Chất liệu dây': 'Thép không gỉ 316L',
      'Bộ máy': 'Quartz Japanese Movement',
      'Xuất xứ': 'Nhật Bản / Lắp ráp chuẩn quốc tế'
    },
    colors: [
      { name: 'Vàng Hoàng Kim', hex: '#D4AF37' },
      { name: 'Bạc Thép 316L', hex: '#C0C0C0' },
      { name: 'Đen Mờ (Matte Black)', hex: '#222222' }
    ],
    sizes: ['Free Size (Có thể điều chỉnh mắt xích)'],
    reviews: [
      {
        id: 'rev-1',
        userName: 'Trần Minh Hoàng',
        rating: 5,
        comment: 'Đồng hồ đẹp xuất sắc, nước mạ vàng mờ nhìn cực kỳ sang và không bị phô. Hộp đóng gói chuẩn luxury.',
        createdAt: '2026-08-20T10:15:00Z',
        verifiedPurchase: true
      },
      {
        id: 'rev-2',
        userName: 'Nguyễn Thảo Ly',
        rating: 5,
        comment: 'Mua tặng bạn trai, anh ấy rất thích. Giao hàng hỏa tốc trong 2h rất chuyên nghiệp.',
        createdAt: '2026-08-25T14:30:00Z',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'cm-prod-002',
    slug: 'sneaker-minimal-leather-low-top',
    name: 'Sneaker Minimal Leather Low-Top',
    category: 'Giày',
    price: 2450000,
    originalPrice: 2850000,
    isNew: true,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 42,
    stock: 22,
    sku: 'CM-SHOE-002',
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop'
    ],
    shortDescription: 'Giày sneaker da bê nguyên tấm Ý, đế cao su Margom đúc nguyên khối siêu êm.',
    description: 'Được chế tác từ da bò Nappa nhập khẩu từ vùng Tuscany (Ý), đôi sneaker mang phom dáng Low-top chuẩn mực phong cách Scandinavian. Không họa tiết cầu kỳ, đôi giày thu hút bởi những đường kim mũi chỉ thẳng tắp và lớp lót da thật thoáng khí khử mùi.',
    features: [
      '100% da bò Nappa tự nhiên siêu mềm mịn',
      'Đế cao su lưu hóa chống trượt và hạn chế mài mòn',
      'Lót giày bằng memory foam bọc da êm ái cả ngày',
      'Gia công thủ công khâu viền McKay bền bỉ'
    ],
    specifications: {
      'Chất liệu thân': 'Full-grain Italian Calfskin',
      'Chất liệu lót': 'Soft Goat Leather',
      'Độ cao đế': '3.2 cm',
      'Trọng lượng': '380g / chiếc',
      'Bảo dưỡng': 'Tặng kèm xi dưỡng chuyên dụng'
    },
    colors: [
      { name: 'Trắng Sữa (Off-White)', hex: '#F5F5F0' },
      { name: 'Đen Tuyển Chọn (Onyx Black)', hex: '#111111' },
      { name: 'Xám Xi Măng (Concrete)', hex: '#A8A8A8' }
    ],
    sizes: ['39', '40', '41', '42', '43', '44'],
    reviews: [
      {
        id: 'rev-3',
        userName: 'Lê Tuấn Anh',
        rating: 5,
        comment: 'Form giày ôm chân vừa vặn, da mềm ngay từ lần đầu xỏ. Đi bộ cả ngày không bị đau gót.',
        createdAt: '2026-08-18T09:00:00Z',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'cm-prod-003',
    slug: 'tui-shoulder-classic-calfskin',
    name: 'Túi Shoulder Classic Calfskin',
    category: 'Túi & Ví',
    price: 3650000,
    originalPrice: 4200000,
    isNew: true,
    isFeatured: true,
    rating: 5.0,
    reviewCount: 29,
    stock: 8,
    sku: 'CM-BAG-003',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1000&auto=format&fit=crop'
    ],
    shortDescription: 'Túi đeo vai cấu trúc hình học tối giản từ da bê mềm vân hạt mịn cao cấp.',
    description: 'Biểu tượng của sự tinh tế đương đại. Chiếc túi Shoulder Classic có cấu trúc đứng form mềm, khóa nam châm ẩn và chi tiết kim loại mạ bạc mờ chống xước. Không gian bên trong được chia ngăn thông minh, vừa vặn điện thoại Pro Max, ví dài và các vật dụng thiết yếu.',
    features: [
      'Da bê vân hạt chống trầy xước và bám bẩn',
      'Khóa kim loại phay xước Palladium cao cấp',
      'Dây đeo có thể tùy chỉnh độ dài đeo vai hoặc đeo chéo',
      'Nội thất lót vải microfiber nhung sang trọng'
    ],
    specifications: {
      'Kích thước': '26 cm x 16 cm x 7 cm',
      'Trọng lượng': '450g',
      'Chiều dài dây': '85 - 110 cm',
      'Phụ kiện đi kèm': 'Túi vải Dustbag chống ẩm cao cấp'
    },
    colors: [
      { name: 'Đen Noir', hex: '#0D0D0D' },
      { name: 'Màu Kem (Warm Ivory)', hex: '#EAE5D9' },
      { name: 'Nâu Espresso', hex: '#3E2723' }
    ],
    sizes: ['Medium Size (26cm)'],
    reviews: [
      {
        id: 'rev-4',
        userName: 'Phạm Quỳnh Chi',
        rating: 5,
        comment: 'Túi cực kỳ đẹp và sắc nét, đường chỉ may đều tăm tắp. Màu kem nhìn sang trọng vô cùng.',
        createdAt: '2026-08-22T16:20:00Z',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'cm-prod-004',
    slug: 'ao-oversize-premium-heavyweight-cotton',
    name: 'Áo Oversize Premium Heavyweight Cotton',
    category: 'Thời trang',
    price: 850000,
    originalPrice: 1050000,
    isNew: false,
    isFeatured: true,
    rating: 4.7,
    reviewCount: 65,
    stock: 40,
    sku: 'CM-APP-004',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop'
    ],
    shortDescription: 'Áo thun phom rộng định lượng 280 GSM dệt từ 100% sợi bông Cotton chải kỹ.',
    description: 'Định nghĩa lại chiếc áo thun hàng ngày. Với định lượng vải dày dặn 280 GSM xử lý bề mặt Enzyme Wash mang lại độ rũ hoàn hảo và không bị xù lông. Cổ áo bo rib dệt dày dặn chống giãn qua hàng trăm lần giặt.',
    features: [
      '100% Combed Compact Cotton thoáng mát và dày dặn',
      'Định lượng vải 280 GSM đứng form sang trọng',
      'Xử lý co rút tiền sản xuất (< 1%)',
      'Đường may giấu mép tinh tế chuẩn xuất khẩu'
    ],
    specifications: {
      'Định lượng': '280 GSM',
      'Kiểu dệt': 'Single Jersey Compact',
      'Form dáng': 'Drop-shoulder Boxy Relaxed',
      'Xuất xứ': 'Sản xuất tại TP. Hồ Chí Minh'
    },
    colors: [
      { name: 'Trắng Tinh Khiết', hex: '#FFFFFF' },
      { name: 'Đen Mờ (Charcoal Black)', hex: '#1C1C1C' },
      { name: 'Xám Tiêu (Heather Grey)', hex: '#D3D3D3' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    reviews: [
      {
        id: 'rev-5',
        userName: 'Đỗ Hữu Thắng',
        rating: 5,
        comment: 'Chất vải đỉnh cao, dày dặn nhưng mặc rất mát và rũ form. 850k quá xứng đáng cho chiếc áo này.',
        createdAt: '2026-08-28T11:45:00Z',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'cm-prod-005',
    slug: 'tai-nghe-wireless-high-fidelity-anc',
    name: 'Tai nghe Wireless High-Fidelity ANC',
    category: 'Công nghệ',
    price: 4850000,
    originalPrice: 5600000,
    isNew: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 31,
    stock: 12,
    sku: 'CM-TECH-005',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1000&auto=format&fit=crop'
    ],
    shortDescription: 'Tai nghe chụp tai chống ồn chủ động Hybrid ANC, màng loa Beryllium 40mm cao cấp.',
    description: 'Sự hòa quyện giữa kỹ thuật âm thanh phòng thu và thẩm mỹ kim loại anodized. Hệ thống chống ồn Hybrid Active Noise Cancelling chặn đến 98% tiếng ồn xung quanh, kết hợp thời lượng pin 45 giờ nghe liên tục và đệm tai bọt khí bọc da mềm.',
    features: [
      'Chống ồn chủ động thích ứng Adaptive ANC',
      'Hỗ trợ giải mã âm thanh chuẩn Hi-Res Audio / LDAC / aptX HD',
      'Thời lượng pin lên đến 45 giờ (35 giờ khi bật ANC)',
      'Sạc nhanh 15 phút nghe được 6 giờ'
    ],
    specifications: {
      'Driver': '40mm Custom Beryllium Diaphragm',
      'Kết nối': 'Bluetooth 5.3 + Cáp Jack 3.5mm mạ vàng',
      'Cổng sạc': 'USB Type-C',
      'Trọng lượng': '245g'
    },
    colors: [
      { name: 'Đen Nhôm Anodized', hex: '#181818' },
      { name: 'Bạc Titan (Silver Titanium)', hex: '#E0E0E0' },
      { name: 'Cát Sa Mạc (Sandstone)', hex: '#C2B299' }
    ],
    sizes: ['One Size Fits All'],
    reviews: [
      {
        id: 'rev-6',
        userName: 'Vũ Quốc Bảo',
        rating: 5,
        comment: 'Âm bass đánh tròn trịa, dải treble sáng không gắt. Hoàn thiện kim loại đẹp không tì vết.',
        createdAt: '2026-08-15T08:30:00Z',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'cm-prod-006',
    slug: 'vong-tay-silver-925-cuff-minimalist',
    name: 'Vòng tay Silver 925 Cuff Minimalist',
    category: 'Phụ kiện',
    price: 1250000,
    originalPrice: 1500000,
    isNew: false,
    isFeatured: false,
    rating: 4.9,
    reviewCount: 22,
    stock: 18,
    sku: 'CM-ACC-006',
    images: [
      'https://images.unsplash.com/photo-1611591475155-4286fafb339e?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop'
    ],
    shortDescription: 'Vòng tay bạc nguyên khối Sterling Silver 925 đánh bóng thủ công với đường cắt vát.',
    description: 'Thiết kế Open-cuff hiện đại, có thể linh hoạt nắn chỉnh theo chu vi cổ tay. Bề mặt ngoài được phay xước mờ satin sang trọng, bên trong đánh bóng gương êm ái tiếp xúc da.',
    features: [
      '100% Bạc Sterling 925 nguyên chất',
      'Phủ lớp Rhodium chống oxy hóa xỉn màu',
      'Khắc laser chìm logo CM tinh xảo ở đầu vòng'
    ],
    specifications: {
      'Bản rộng': '6 mm',
      'Độ dày': '2.5 mm',
      'Trọng lượng': '24.5g',
      'Độ mở': 'Điều chỉnh từ 15cm đến 19cm'
    },
    colors: [
      { name: 'Bạc Tự Nhiên (Sterling Silver)', hex: '#E5E5E5' },
      { name: 'Mạ Vàng Trắng 18K', hex: '#F0F0F0' }
    ],
    sizes: ['Size S (Cổ tay 14-16cm)', 'Size M (Cổ tay 16-18cm)', 'Size L (Cổ tay 18-20cm)'],
    reviews: [
      {
        id: 'rev-7',
        userName: 'Bùi Kim Ngân',
        rating: 5,
        comment: 'Bạc đầm tay, đeo vào nhìn thanh lịch và rất có gu. Hộp đựng nhung đen rất đẹp.',
        createdAt: '2026-08-24T20:10:00Z',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'cm-prod-007',
    slug: 'kinh-classic-polarized-acetate',
    name: 'Kính Mát Classic Polarized Acetate',
    category: 'Phụ kiện',
    price: 1650000,
    originalPrice: 1950000,
    isNew: true,
    isFeatured: false,
    rating: 4.8,
    reviewCount: 19,
    stock: 25,
    sku: 'CM-ACC-007',
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508296695146-257a814070b4?q=80&w=1000&auto=format&fit=crop'
    ],
    shortDescription: 'Gọng nhựa thực vật Cellulose Acetate từ Ý, tròng kính phân cực chống tia UV400.',
    description: 'Form kính vuông kinh điển tôn dáng khuôn mặt Châu Á. Gọng kính cắt gọt từ khối Acetate cao cấp không bị giòn theo thời gian, bản lề 5 chấu bằng thép của Đức vận hành êm ái.',
    features: [
      'Tròng Polarized triệt tiêu ánh sáng chói lóa',
      'Ngăn chặn 100% tia cực tím UVA/UVB (UV400)',
      'Bản lề 5-barrel hinge mạ niken bền bỉ'
    ],
    specifications: {
      'Kích thước': '52 - 19 - 145 mm',
      'Chất liệu gọng': 'Mazzucchelli Italian Acetate',
      'Phụ kiện': 'Bao da gấp gọn + Khăn lau nano'
    },
    colors: [
      { name: 'Đen Bóng (Glossy Black)', hex: '#111111' },
      { name: 'Đồi Mồi Cổ Điển (Tortoise)', hex: '#5A3825' },
      { name: 'Xám Khói Trong Suốt', hex: '#686868' }
    ],
    sizes: ['Standard 52mm'],
    reviews: [
      {
        id: 'rev-8',
        userName: 'Ngô Việt Dũng',
        rating: 5,
        comment: 'Đeo vừa vặn, không bị trượt sống mũi. Tròng kính nhìn rất dịu mắt khi đi trời nắng gắt.',
        createdAt: '2026-08-21T15:00:00Z',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'cm-prod-008',
    slug: 'smart-watch-sapphire-edition',
    name: 'Smart Watch Sapphire Edition',
    category: 'Công nghệ',
    price: 5900000,
    originalPrice: 6800000,
    isNew: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 34,
    stock: 9,
    sku: 'CM-TECH-008',
    images: [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1510017803434-a899398421b3?q=80&w=1000&auto=format&fit=crop'
    ],
    shortDescription: 'Mặt kính Sapphire nguyên khối, vỏ hợp kim Titan cấp hàng không, pin 14 ngày.',
    description: 'Sự kết hợp đỉnh cao giữa đồng hồ cơ truyền thống và công nghệ thông minh. Màn hình AMOLED 1.43 inch Always-On Display rực rỡ dưới ánh sáng mặt trời, cảm biến sinh trắc học theo dõi nhịp tim 24/7, nồng độ oxy SpO2 và giấc ngủ chuyên sâu.',
    features: [
      'Kính Sapphire chống xước tuyệt đối độ cứng Mohs 9',
      'Vỏ Titan siêu nhẹ và chống ăn mòn nước biển',
      'Định vị GPS băng tần kép độc lập chính xác cao',
      'Thời lượng pin lên đến 14 ngày sử dụng bình thường'
    ],
    specifications: {
      'Màn hình': '1.43" AMOLED 466x466 px 1000 nits',
      'Chống nước': '5 ATM + Tiêu chuẩn lặn biển',
      'Tương thích': 'iOS 12+ / Android 8.0+',
      'Dây đeo': 'Dây da thuộc tự nhiên + Tặng dây cao su thể thao FKM'
    },
    colors: [
      { name: 'Titanium Xám Vũ Trụ', hex: '#3B3B3B' },
      { name: 'Bạc Ánh Kim', hex: '#D8D8D8' }
    ],
    sizes: ['42mm', '46mm'],
    reviews: [
      {
        id: 'rev-9',
        userName: 'Hoàng Văn Nam',
        rating: 5,
        comment: 'Đồng hồ thiết kế quá đẹp, mặt kính sapphire trong vắt. Pin dùng hơn 10 ngày chưa phải sạc.',
        createdAt: '2026-08-27T19:20:00Z',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'cm-prod-009',
    slug: 'premium-hoodie-french-terry-relaxed',
    name: 'Premium Hoodie French Terry Relaxed',
    category: 'Thời trang',
    price: 1350000,
    originalPrice: 1650000,
    isNew: false,
    isFeatured: false,
    rating: 4.8,
    reviewCount: 51,
    stock: 28,
    sku: 'CM-APP-009',
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1000&auto=format&fit=crop'
    ],
    shortDescription: 'Áo nỉ có mũ định lượng 450 GSM vải chân cua French Terry cao cấp không xù lông.',
    description: 'Chiếc hoodie được thiết kế cho sự thoải mái tối thượng với trọng lượng vải đầm chắc. Mũ trùm 2 lớp đứng form không bị rũ, túi kangaroo phía trước may ẩn tinh tế cùng viền bo gân dày dặn.',
    features: [
      'Vải dệt chân cua 100% bông hữu cơ Organic Cotton',
      'Định lượng siêu dày dặn 450 GSM',
      'Mũ 2 lớp giữ form cứng cáp',
      'Bo chun tay và gấu áo dệt rib co giãn đàn hồi tốt'
    ],
    specifications: {
      'Định lượng': '450 GSM French Terry',
      'Form dáng': 'Relaxed Fit',
      'Chăm sóc': 'Giặt máy chế độ nhẹ, không sấy nhiệt độ cao'
    },
    colors: [
      { name: 'Xám Tro (Oatmeal)', hex: '#D6D1CA' },
      { name: 'Đen Tuyệt Đối', hex: '#111111' },
      { name: 'Xanh Rêu Đậm (Forest Pine)', hex: '#2A342B' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    reviews: [
      {
        id: 'rev-10',
        userName: 'Lê Minh Quân',
        rating: 5,
        comment: 'Hoodie chuẩn phom dáng minimalism, vải dày dặn cầm nặng tay cực kỳ thích.',
        createdAt: '2026-08-23T13:10:00Z',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'cm-prod-010',
    slug: 'leather-wallet-bifold-full-grain',
    name: 'Leather Wallet Bifold Full-Grain',
    category: 'Túi & Ví',
    price: 950000,
    originalPrice: 1200000,
    isNew: false,
    isFeatured: false,
    rating: 4.9,
    reviewCount: 47,
    stock: 35,
    sku: 'CM-BAG-010',
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1606503829023-e298dfb9f074?q=80&w=1000&auto=format&fit=crop'
    ],
    shortDescription: 'Ví da nam gập đôi từ da bò sáp Veg-Tan càng dùng càng bóng đẹp theo thời gian.',
    description: 'Chế tác từ da thuộc thảo mộc tự nhiên không hóa chất độc hại (Vegetable Tanned Leather). Độ mỏng chỉ 0.8 cm khi không để đồ nhưng chứa được hơn 8 thẻ tín dụng, tiền mặt và giấy tờ tùy thân với lớp lót chống trộm sóng RFID.',
    features: [
      'Da thuộc thảo mộc tạo lớp patina bóng loáng sau 3-6 tháng',
      'Tích hợp lá chắn RFID chặn quét trộm thẻ tín dụng',
      '8 khe cắm thẻ + 2 ngăn chứa tiền thẳng nếp',
      'Cạnh ví được đánh bóng sáp ong thủ công'
    ],
    specifications: {
      'Kích thước': '11.5 cm x 9.0 cm x 0.8 cm',
      'Chất liệu': '100% Full-Grain Veg-Tan Leather',
      'Màu sắc hoàn thiện': 'Nhuộm tay thủ công'
    },
    colors: [
      { name: 'Nâu Cà Phê (Espresso)', hex: '#3E2723' },
      { name: 'Đen Mờ (Matte Black)', hex: '#1C1C1C' },
      { name: 'Nâu Da Bò (Cognac Tan)', hex: '#8B5A2B' }
    ],
    sizes: ['Slim Bifold'],
    reviews: [
      {
        id: 'rev-11',
        userName: 'Trịnh Thế Vinh',
        rating: 5,
        comment: 'Da thơm mùi thảo mộc tự nhiên, ví mỏng nhét túi quần không bị cộm. Rất ưng ý.',
        createdAt: '2026-08-19T17:40:00Z',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'cm-prod-011',
    slug: 'minimal-backpack-waterproof-nylon-leather',
    name: 'Minimal Backpack Waterproof Cordura & Leather',
    category: 'Túi & Ví',
    price: 2850000,
    originalPrice: 3400000,
    isNew: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 36,
    stock: 14,
    sku: 'CM-BAG-011',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1577733966973-d680bffd2e80?q=80&w=1000&auto=format&fit=crop'
    ],
    shortDescription: 'Balo chống nước chuẩn quân đội Cordura 1000D phối da bò thật, ngăn laptop 16 inch.',
    description: 'Thiết kế khí động học nguyên khối loại bỏ mọi chi tiết rườm rà. Ngăn chống sốc 3 lớp bảo vệ laptop MacBook Pro 16 inch, khóa kéo chống nước YKK AquaGuard cùng quai đeo đệm thoáng khí công thái học.',
    features: [
      'Vải Cordura 1000D chống thấm nước và chống rách tuyệt đối',
      'Ngăn laptop 16" lót lông cừu êm ái treo lơ lửng chống va đập đáy',
      'Dây đai vali phía sau tiện lợi khi đi công tác',
      'Khóa kéo kim loại YKK chống nước mượt mà'
    ],
    specifications: {
      'Dung tích': '22 Lít',
      'Kích thước': '45 cm x 30 cm x 15 cm',
      'Trọng lượng': '850g',
      'Bảo hành': '5 năm đường may và phụ kiện'
    },
    colors: [
      { name: 'Đen Tuyệt Đối (Stealth Black)', hex: '#111111' },
      { name: 'Xám Than (Charcoal)', hex: '#333333' }
    ],
    sizes: ['22 Liters'],
    reviews: [
      {
        id: 'rev-12',
        userName: 'Nguyễn Đăng Khoa',
        rating: 5,
        comment: 'Balo đứng dáng rất đẹp kể cả khi không đựng nhiều đồ. Đi mưa to nước trượt trôi hoàn toàn.',
        createdAt: '2026-08-26T10:05:00Z',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'cm-prod-012',
    slug: 'classic-shirt-tailored-oxford',
    name: 'Classic Shirt Tailored Oxford',
    category: 'Thời trang',
    price: 1150000,
    originalPrice: 1400000,
    isNew: false,
    isFeatured: false,
    rating: 4.8,
    reviewCount: 44,
    stock: 30,
    sku: 'CM-APP-012',
    images: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000&auto=format&fit=crop'
    ],
    shortDescription: 'Áo sơ mi vải Oxford dệt sợi đôi 100% cotton Ai Cập, cúc xà cừ tự nhiên.',
    description: 'Chiếc áo sơ mi may đo cổ button-down hoàn hảo cho cả trang phục công sở lẫn phong cách smart-casual cuối tuần. Vải Oxford sợi đôi cao cấp có độ xốp nhẹ tự nhiên, thấm hút mồ hôi và dễ ủi.',
    features: [
      '100% Egyptian Giza Cotton chải kỹ mềm mịn',
      'Cúc áo làm từ vỏ ốc xà cừ tự nhiên Mother-of-Pearl',
      'Cổ áo ép keo mềm không gây cứng rát gáy',
      'Mật độ mũi may 21 mũi / inch tinh xảo'
    ],
    specifications: {
      'Chất liệu': '100% 2-ply Oxford Cotton',
      'Form dáng': 'Tailored Slim Fit',
      'Cổ áo': 'Button-Down Collar 7.5cm',
      'Xuất xứ': 'Sản xuất tại TP. Hồ Chí Minh'
    },
    colors: [
      { name: 'Trắng Sơ Mi (Pure White)', hex: '#FFFFFF' },
      { name: 'Xanh Pastel (Sky Blue)', hex: '#C6D8E3' },
      { name: 'Kẻ Sọc Xanh Thanh Lịch', hex: '#A2B9C8' }
    ],
    sizes: ['38 (S)', '39 (M)', '40 (L)', '41 (XL)', '42 (XXL)'],
    reviews: [
      {
        id: 'rev-13',
        userName: 'Trần Đình Trọng',
        rating: 5,
        comment: 'Sơ mi form đẹp, cúc xà cừ lấp lánh rất tinh tế. Mặc với quần âu hay jeans đều chuẩn.',
        createdAt: '2026-08-22T08:15:00Z',
        verifiedPurchase: true
      }
    ]
  }
];
