-- ==========================================
-- Rajesh Enterprises - Supabase Schema
-- ==========================================

-- Enable pgcrypto for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- 1. Tables
-- ==========================================

-- User Profiles
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'customer' CHECK (role IN ('super_admin', 'admin', 'manager', 'staff', 'customer')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Addresses
CREATE TABLE public.addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT DEFAULT 'Home',
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    province TEXT NOT NULL,
    district TEXT NOT NULL,
    municipality TEXT NOT NULL,
    ward TEXT,
    street_tole TEXT NOT NULL,
    landmark TEXT,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Categories
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    name_np TEXT,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Brands
CREATE TABLE public.brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Products
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    title_np TEXT,
    slug TEXT UNIQUE NOT NULL,
    sku TEXT UNIQUE,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    brand_id UUID REFERENCES public.brands(id) ON DELETE SET NULL,
    short_description TEXT,
    description TEXT,
    specifications JSONB,
    usage_instructions TEXT,
    safety_information TEXT,
    regular_price NUMERIC(10, 2) NOT NULL,
    discount_price NUMERIC(10, 2),
    cost_price NUMERIC(10, 2),
    stock_quantity INTEGER DEFAULT 0,
    min_stock_threshold INTEGER DEFAULT 5,
    unit TEXT, -- e.g., kg, g, liter, piece
    weight NUMERIC(10, 3),
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    is_bestseller BOOLEAN DEFAULT false,
    is_new_arrival BOOLEAN DEFAULT false,
    tags TEXT[],
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Product Images
CREATE TABLE public.product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text TEXT,
    is_primary BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0
);

-- Product Variants
CREATE TABLE public.product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    sku TEXT,
    name TEXT NOT NULL, -- e.g., "500g", "1L"
    price_adjustment NUMERIC(10, 2) DEFAULT 0,
    stock_quantity INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true
);

-- Orders
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL, -- e.g., RE-2026-000001
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned', 'refunded')),
    subtotal NUMERIC(10, 2) NOT NULL,
    discount NUMERIC(10, 2) DEFAULT 0,
    delivery_charge NUMERIC(10, 2) DEFAULT 0,
    total NUMERIC(10, 2) NOT NULL,
    payment_method TEXT NOT NULL,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    shipping_address JSONB NOT NULL,
    customer_notes TEXT,
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Order Items
CREATE TABLE public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    variant_name TEXT,
    quantity INTEGER NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL
);

-- Reviews
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    review_text TEXT,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Wishlist
CREATE TABLE public.wishlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE
);

CREATE TABLE public.wishlist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wishlist_id UUID REFERENCES public.wishlists(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(wishlist_id, product_id)
);


-- ==========================================
-- 2. Triggers
-- ==========================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- Auto-create profile for new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'customer');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Generate Order Number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS trigger AS $$
DECLARE
    year TEXT;
    seq_val INTEGER;
BEGIN
    year := to_char(now(), 'YYYY');
    -- A simple sequence based on a table or counting rows for demo purposes.
    -- In production, a real sequence should be used.
    SELECT COUNT(*) + 1 INTO seq_val FROM public.orders;
    NEW.order_number := 'RE-' || year || '-' || lpad(seq_val::text, 6, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_insert_orders
    BEFORE INSERT ON public.orders
    FOR EACH ROW
    WHEN (NEW.order_number IS NULL)
    EXECUTE PROCEDURE generate_order_number();


-- ==========================================
-- 3. Row Level Security (RLS) Policies
-- ==========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;

-- Helper function to check admin status
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin', 'manager')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Users can view and edit their own. Admins can view/edit all.
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id OR is_admin());
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id OR is_admin());

-- Addresses: Users can manage their own.
CREATE POLICY "Users manage own addresses" ON public.addresses FOR ALL USING (auth.uid() = user_id OR is_admin());

-- Products, Categories, Brands: Public read, Admin write
CREATE POLICY "Public read active categories" ON public.categories FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "Admin full access categories" ON public.categories FOR ALL USING (is_admin());

CREATE POLICY "Public read active brands" ON public.brands FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "Admin full access brands" ON public.brands FOR ALL USING (is_admin());

CREATE POLICY "Public read active products" ON public.products FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "Admin full access products" ON public.products FOR ALL USING (is_admin());

CREATE POLICY "Public read product images" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Admin full access product images" ON public.product_images FOR ALL USING (is_admin());

CREATE POLICY "Public read active product variants" ON public.product_variants FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "Admin full access product variants" ON public.product_variants FOR ALL USING (is_admin());

-- Orders: Users can read their own, insert their own. Admin full access.
CREATE POLICY "Users can insert own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Admin full access orders" ON public.orders FOR ALL USING (is_admin());

CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid()) OR is_admin()
);
CREATE POLICY "Users can insert own order items" ON public.order_items FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid())
);
CREATE POLICY "Admin full access order items" ON public.order_items FOR ALL USING (is_admin());

-- Reviews: Public read approved, Users manage their own.
CREATE POLICY "Public read approved reviews" ON public.reviews FOR SELECT USING (is_approved = true OR auth.uid() = user_id OR is_admin());
CREATE POLICY "Users can insert own reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Users can delete own reviews" ON public.reviews FOR DELETE USING (auth.uid() = user_id OR is_admin());

-- Wishlists: Users manage their own.
CREATE POLICY "Users manage own wishlists" ON public.wishlists FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own wishlist items" ON public.wishlist_items FOR ALL USING (
    EXISTS (SELECT 1 FROM public.wishlists WHERE id = wishlist_id AND user_id = auth.uid())
);


-- ==========================================
-- 4. Initial Setup Data
-- ==========================================

-- (Optionally, users can insert seed data here)

