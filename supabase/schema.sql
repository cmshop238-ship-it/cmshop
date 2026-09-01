-- ==========================================================
-- CM LUXURY E-COMMERCE DATABASE SCHEMA (SUPABASE / POSTGRESQL)
-- Production ready for domain: cmshop.online
-- ==========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY DEFAULT ('cat-' || extract(epoch from now())),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY DEFAULT ('cm-prod-' || extract(epoch from now())),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
    category_name TEXT NOT NULL,
    price BIGINT NOT NULL CHECK (price >= 0),
    original_price BIGINT CHECK (original_price >= price),
    is_new BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    review_count INT DEFAULT 0,
    stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    sku TEXT NOT NULL UNIQUE,
    images JSONB DEFAULT '[]'::jsonb,
    short_description TEXT,
    description TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    specifications JSONB DEFAULT '{}'::jsonb,
    colors JSONB DEFAULT '[]'::jsonb,
    sizes JSONB DEFAULT '[]'::jsonb,
    brand TEXT DEFAULT 'CM Official',
    material TEXT,
    origin TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'hidden', 'draft')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Users / Customers & Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone_number TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Customer Addresses
CREATE TABLE IF NOT EXISTS addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    email TEXT NOT NULL,
    province TEXT NOT NULL,
    district TEXT NOT NULL,
    ward TEXT NOT NULL,
    street_address TEXT NOT NULL,
    note TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    tag TEXT DEFAULT 'Nhà riêng',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Coupons Table
CREATE TABLE IF NOT EXISTS coupons (
    code TEXT PRIMARY KEY,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value BIGINT NOT NULL CHECK (discount_value > 0),
    minimum_order BIGINT NOT NULL DEFAULT 0,
    max_discount BIGINT,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    usage_limit INT,
    usage_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY, -- e.g. CM-2026-98124
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    customer_info JSONB NOT NULL,
    subtotal BIGINT NOT NULL,
    shipping_fee BIGINT NOT NULL DEFAULT 0,
    shipping_method TEXT NOT NULL CHECK (shipping_method IN ('standard', 'express')),
    discount_amount BIGINT NOT NULL DEFAULT 0,
    applied_coupon TEXT REFERENCES coupons(code),
    total_amount BIGINT NOT NULL CHECK (total_amount >= 0),
    payment_method TEXT NOT NULL CHECK (payment_method IN ('cod', 'bank_transfer', 'vnpay', 'momo', 'zalopay', 'credit_card')),
    payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded', 'failed')),
    order_status TEXT NOT NULL DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'processing', 'shipping', 'delivered', 'cancelled')),
    tracking_number TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    product_image TEXT,
    sku TEXT NOT NULL,
    selected_variant_text TEXT,
    quantity INT NOT NULL CHECK (quantity > 0),
    price BIGINT NOT NULL,
    subtotal BIGINT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Product Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL,
    user_avatar TEXT,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    verified_purchase BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'hidden')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Inventory Audit Logs
CREATE TABLE IF NOT EXISTS inventory_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    change_amount INT NOT NULL,
    previous_stock INT NOT NULL,
    new_stock INT NOT NULL,
    reason TEXT NOT NULL,
    order_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Store Global Settings
CREATE TABLE IF NOT EXISTS store_settings (
    id INT PRIMARY KEY DEFAULT 1,
    store_name TEXT NOT NULL DEFAULT 'CM Luxury & Quality Products',
    hotline TEXT,
    email TEXT,
    address TEXT,
    support_hours TEXT,
    bank_name TEXT,
    bank_account_number TEXT,
    bank_account_name TEXT,
    bank_bin TEXT,
    standard_shipping_fee BIGINT DEFAULT 30000,
    express_shipping_fee BIGINT DEFAULT 50000,
    free_shipping_threshold BIGINT DEFAULT 2000000,
    is_demo_data BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
