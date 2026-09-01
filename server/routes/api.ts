import { Router, Request, Response } from 'express';
import { db } from '../db/database';
import { authenticateToken, requireAdmin, AuthenticatedRequest } from '../middleware/auth';

export const apiRouter = Router();

// ==========================================
// 1. PRODUCTS API
// ==========================================

// GET /api/products (Public with filters & search)
apiRouter.get('/products', (req: Request, res: Response) => {
  try {
    const category = req.query.category as string;
    const search = req.query.search as string;
    const status = req.query.status as string;

    const products = db.getProducts({ category, search, status });
    return res.json({ success: true, data: products, total: products.length });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/products/admin (Admin full view including hidden/draft)
apiRouter.get('/products/admin', requireAdmin, (req: Request, res: Response) => {
  try {
    const products = db.getAllProductsAdmin();
    return res.json({ success: true, data: products, total: products.length });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/products/:identifier (id or slug)
apiRouter.get('/products/:identifier', (req: Request, res: Response) => {
  try {
    const { identifier } = req.params;
    let product = db.getProductBySlug(identifier);
    if (!product) {
      product = db.getProductById(identifier);
    }

    if (!product) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy sản phẩm.' });
    }

    return res.json({ success: true, data: product });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/products (Admin Create)
apiRouter.post('/products', requireAdmin, (req: Request, res: Response) => {
  try {
    const { name, category, price, sku, stock, images, description, shortDescription } = req.body;

    if (!name || !price || !sku) {
      return res.status(400).json({ success: false, error: 'Vui lòng nhập đầy đủ tên, giá và SKU.' });
    }

    const slug = req.body.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newProd = db.createProduct({
      name,
      slug,
      category: category || 'Thời trang',
      price: Number(price),
      originalPrice: req.body.originalPrice ? Number(req.body.originalPrice) : undefined,
      isNew: req.body.isNew ?? true,
      isFeatured: req.body.isFeatured ?? false,
      rating: 5.0,
      reviewCount: 0,
      stock: Number(stock || 0),
      sku: sku.trim(),
      images: Array.isArray(images) && images.length ? images : ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop'],
      description: description || '',
      shortDescription: shortDescription || '',
      features: req.body.features || [],
      specifications: req.body.specifications || {},
      colors: req.body.colors || [],
      sizes: req.body.sizes || [],
      brand: req.body.brand || 'CM Official',
      material: req.body.material,
      origin: req.body.origin,
      status: req.body.status || 'active',
    });

    return res.status(201).json({ success: true, data: newProd });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/products/:id (Admin Update)
apiRouter.put('/products/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = db.updateProduct(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy sản phẩm để cập nhật.' });
    }
    return res.json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/products/:id (Admin Delete)
apiRouter.delete('/products/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteProduct(id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy sản phẩm để xóa.' });
    }
    return res.json({ success: true, message: 'Đã xóa sản phẩm thành công.' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 2. CATEGORIES API
// ==========================================

apiRouter.get('/categories', (req: Request, res: Response) => {
  try {
    const categories = db.getCategories();
    return res.json({ success: true, data: categories });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/categories', requireAdmin, (req: Request, res: Response) => {
  try {
    const { name, description, image, displayOrder } = req.body;
    if (!name) return res.status(400).json({ success: false, error: 'Tên danh mục là bắt buộc.' });

    const slug = req.body.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newCat = db.createCategory({
      name,
      slug,
      description: description || '',
      image: image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop',
      displayOrder: displayOrder || 99,
    });

    return res.status(201).json({ success: true, data: newCat });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 3. ORDERS API (CRITICAL BUSINESS FLOW)
// ==========================================

// POST /api/orders (Create Order with server-side price calculation & stock deduction)
apiRouter.post('/orders', async (req: Request, res: Response) => {
  try {
    const { customer, items, shippingMethod, paymentMethod, couponCode, userId } = req.body;

    if (!customer || !customer.fullName || !customer.phoneNumber || !customer.streetAddress) {
      return res.status(400).json({
        success: false,
        error: 'Vui lòng cung cấp đầy đủ thông tin giao hàng (Họ tên, SĐT, Địa chỉ).',
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Giỏ hàng trống. Vui lòng chọn ít nhất 1 sản phẩm.',
      });
    }

    // Atomic server-authoritative order creation
    const order = await db.createOrderAtomic({
      customer,
      items,
      shippingMethod: shippingMethod || 'standard',
      paymentMethod: paymentMethod || 'cod',
      couponCode,
      userId,
    });

    return res.status(201).json({
      success: true,
      message: 'Đặt hàng thành công.',
      data: order,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      error: err.message || 'Lỗi trong quá trình tạo đơn hàng.',
    });
  }
});

// GET /api/orders (List orders for user or admin)
apiRouter.get('/orders', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const status = req.query.status as string;

    if (user.role === 'admin') {
      const orders = db.getOrders({ status });
      return res.json({ success: true, data: orders, total: orders.length });
    } else {
      // Customer only sees their orders
      const orders = db.getOrders({ userId: user.id, status });
      return res.json({ success: true, data: orders, total: orders.length });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/orders/:id (Find single order by ID - guest tracking or user)
apiRouter.get('/orders/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = db.getOrderById(id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy đơn hàng với mã này.' });
    }
    return res.json({ success: true, data: order });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/orders/:id/status (Admin change order status)
apiRouter.put('/orders/:id/status', requireAdmin, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'processing', 'shipping', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Trạng thái đơn hàng không hợp lệ.' });
    }

    const updated = db.updateOrderStatus(id, status);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy đơn hàng.' });
    }

    return res.json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/orders/:id/payment-status (Admin update payment status)
apiRouter.put('/orders/:id/payment-status', requireAdmin, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    if (!['unpaid', 'paid', 'refunded', 'failed'].includes(paymentStatus)) {
      return res.status(400).json({ success: false, error: 'Trạng thái thanh toán không hợp lệ.' });
    }

    const updated = db.updateOrderPaymentStatus(id, paymentStatus);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy đơn hàng.' });
    }

    return res.json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 4. COUPONS API
// ==========================================

// POST /api/coupons/validate (Calculate discount on server)
apiRouter.post('/coupons/validate', (req: Request, res: Response) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, error: 'Vui lòng nhập mã giảm giá.' });
    }

    const coupon = db.getCouponByCode(code);
    if (!coupon || !coupon.isActive) {
      return res.status(400).json({ success: false, error: 'Mã giảm giá không tồn tại hoặc đã hết hạn.' });
    }

    const now = new Date();
    if (new Date(coupon.startDate) > now || new Date(coupon.endDate) < now) {
      return res.status(400).json({ success: false, error: 'Mã giảm giá đã quá hạn sử dụng.' });
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return res.status(400).json({ success: false, error: 'Mã giảm giá đã hết lượt sử dụng.' });
    }

    const orderSubtotal = Number(subtotal || 0);
    if (orderSubtotal < coupon.minimumOrder) {
      return res.status(400).json({
        success: false,
        error: `Mã áp dụng cho đơn hàng tối thiểu từ ${(coupon.minimumOrder).toLocaleString('vi-VN')}₫.`,
      });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = Math.round((orderSubtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    return res.json({
      success: true,
      data: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
        description: coupon.description,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Admin Coupon CRUD
apiRouter.get('/coupons', requireAdmin, (req: Request, res: Response) => {
  return res.json({ success: true, data: db.getCoupons() });
});

apiRouter.post('/coupons', requireAdmin, (req: Request, res: Response) => {
  try {
    const { code, discountType, discountValue, minimumOrder } = req.body;
    if (!code || !discountType || !discountValue) {
      return res.status(400).json({ success: false, error: 'Thiếu thông tin bắt buộc của mã giảm giá.' });
    }

    const newCoupon = db.createCoupon({
      code: code.toUpperCase().trim(),
      discountType,
      discountValue: Number(discountValue),
      minimumOrder: Number(minimumOrder || 0),
      maxDiscount: req.body.maxDiscount ? Number(req.body.maxDiscount) : undefined,
      startDate: req.body.startDate || new Date().toISOString(),
      endDate: req.body.endDate || new Date(Date.now() + 30 * 86400000).toISOString(),
      usageLimit: req.body.usageLimit ? Number(req.body.usageLimit) : undefined,
      usageCount: 0,
      isActive: req.body.isActive ?? true,
      description: req.body.description || `Mã giảm giá ${code}`,
    });

    return res.status(201).json({ success: true, data: newCoupon });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.put('/coupons/:code', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateCoupon(req.params.code, req.body);
  if (!updated) return res.status(404).json({ success: false, error: 'Không tìm thấy coupon.' });
  return res.json({ success: true, data: updated });
});

apiRouter.delete('/coupons/:code', requireAdmin, (req: Request, res: Response) => {
  const deleted = db.deleteCoupon(req.params.code);
  if (!deleted) return res.status(404).json({ success: false, error: 'Không tìm thấy coupon để xóa.' });
  return res.json({ success: true, message: 'Đã xóa coupon.' });
});

// ==========================================
// 5. REVIEWS API
// ==========================================

apiRouter.get('/reviews/product/:productId', (req: Request, res: Response) => {
  const reviews = db.getReviewsByProductId(req.params.productId);
  return res.json({ success: true, data: reviews });
});

apiRouter.post('/reviews', (req: Request, res: Response) => {
  try {
    const { productId, userName, rating, comment } = req.body;
    if (!productId || !userName || !rating || !comment) {
      return res.status(400).json({ success: false, error: 'Vui lòng cung cấp đầy đủ đánh giá và họ tên.' });
    }

    const newRev = db.createReview({
      productId,
      userId: req.body.userId,
      userName: userName.trim(),
      userAvatar: req.body.userAvatar,
      rating: Math.min(5, Math.max(1, Number(rating))),
      comment: comment.trim(),
      verifiedPurchase: req.body.verifiedPurchase ?? true,
      status: 'active',
    });

    return res.status(201).json({ success: true, data: newRev });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.get('/reviews/admin', requireAdmin, (req: Request, res: Response) => {
  return res.json({ success: true, data: db.getAllReviewsAdmin() });
});

apiRouter.put('/reviews/:id/status', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateReviewStatus(req.params.id, req.body.status);
  if (!updated) return res.status(404).json({ success: false, error: 'Không tìm thấy đánh giá.' });
  return res.json({ success: true, data: updated });
});

apiRouter.delete('/reviews/:id', requireAdmin, (req: Request, res: Response) => {
  const deleted = db.deleteReview(req.params.id);
  if (!deleted) return res.status(404).json({ success: false, error: 'Không tìm thấy đánh giá.' });
  return res.json({ success: true, message: 'Đã xóa đánh giá.' });
});

// ==========================================
// 6. AUTHENTICATION & CUSTOMER ACCOUNT
// ==========================================

// POST /api/auth/register
apiRouter.post('/auth/register', (req: Request, res: Response) => {
  try {
    const { email, password, fullName, phoneNumber } = req.body;
    if (!email || !password || !fullName) {
      return res.status(400).json({ success: false, error: 'Vui lòng nhập đầy đủ email, mật khẩu và họ tên.' });
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ success: false, error: 'Email này đã được đăng ký tài khoản.' });
    }

    const user = db.createUser({
      email,
      passwordPlain: password,
      fullName,
      phoneNumber,
      role: 'customer',
    });

    const token = `CM_TOKEN_${user.id}_${Date.now()}`;
    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        role: user.role,
        avatarUrl: user.avatarUrl,
        addresses: user.addresses,
        wishlist: user.wishlist,
        createdAt: user.createdAt,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/auth/login
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Vui lòng nhập email và mật khẩu.' });
    }

    const user = db.verifyUserPassword(email, password);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Email hoặc mật khẩu không chính xác.' });
    }

    const token = `CM_TOKEN_${user.id}_${Date.now()}`;
    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        role: user.role,
        avatarUrl: user.avatarUrl,
        addresses: user.addresses,
        wishlist: user.wishlist,
        createdAt: user.createdAt,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/auth/me
apiRouter.get('/auth/me', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  return res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      role: user.role,
      avatarUrl: user.avatarUrl,
      addresses: user.addresses,
      wishlist: user.wishlist,
      createdAt: user.createdAt,
    },
  });
});

// PUT /api/auth/profile
apiRouter.put('/auth/profile', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const updated = db.updateUserProfile(user.id, req.body);
  return res.json({ success: true, user: updated });
});

// POST /api/auth/addresses
apiRouter.post('/auth/addresses', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const newAddr = {
    ...req.body,
    id: `addr-${Date.now()}`,
  };

  const addresses = [...(user.addresses || [])];
  if (newAddr.isDefault) {
    addresses.forEach((a) => (a.isDefault = false));
  }
  addresses.push(newAddr);

  db.updateUserProfile(user.id, { addresses });
  return res.status(201).json({ success: true, address: newAddr, addresses });
});

// DELETE /api/auth/addresses/:id
apiRouter.delete('/auth/addresses/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const addresses = (user.addresses || []).filter((a) => a.id !== req.params.id);
  db.updateUserProfile(user.id, { addresses });
  return res.json({ success: true, addresses });
});

// ==========================================
// 7. INVENTORY & AUDIT LOGS
// ==========================================

apiRouter.get('/inventory/logs', requireAdmin, (req: Request, res: Response) => {
  const logs = db.getInventoryLogs();
  return res.json({ success: true, data: logs });
});

apiRouter.put('/inventory/adjust', requireAdmin, (req: Request, res: Response) => {
  try {
    const { productId, newStock, reason } = req.body;
    if (!productId || newStock === undefined) {
      return res.status(400).json({ success: false, error: 'Thiếu thông tin điều chỉnh kho.' });
    }

    const updated = db.adjustStock(productId, Number(newStock), reason || 'Điều chỉnh thủ công bởi Quản trị viên');
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy sản phẩm.' });
    }

    return res.json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 8. STORE SETTINGS & DATA MODES
// ==========================================

apiRouter.get('/settings', (req: Request, res: Response) => {
  const settings = db.getSettings();
  return res.json({ success: true, data: settings });
});

apiRouter.put('/settings', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateSettings(req.body);
  return res.json({ success: true, data: updated });
});

apiRouter.post('/settings/data-mode', requireAdmin, (req: Request, res: Response) => {
  const { mode } = req.body;
  if (!['demo', 'clean'].includes(mode)) {
    return res.status(400).json({ success: false, error: 'Chế độ dữ liệu không hợp lệ.' });
  }
  db.switchDataMode(mode);
  return res.json({
    success: true,
    message: mode === 'clean' ? 'Đã chuyển sang chế độ dữ liệu thật sạch.' : 'Đã nạp lại dữ liệu mẫu (Demo Catalog).',
  });
});

// ==========================================
// 9. ANALYTICS & STATS
// ==========================================

apiRouter.get('/analytics/overview', requireAdmin, (req: Request, res: Response) => {
  const analytics = db.getAnalyticsSummary();
  return res.json({ success: true, data: analytics });
});
