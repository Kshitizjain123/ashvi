-- Ashvi Database Schema (idempotent — safe to run on every deploy)

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ENUMS (wrapped in DO blocks so re-runs don't fail)
DO $$ BEGIN CREATE TYPE admin_role AS ENUM ('superadmin', 'manager', 'support'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE payment_method AS ENUM ('card', 'upi', 'cod', 'wallet', 'netbanking'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE payment_status AS ENUM ('pending', 'success', 'failed', 'refunded'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE shipping_status AS ENUM ('preparing', 'dispatched', 'in_transit', 'out_for_delivery', 'delivered', 'failed'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE discount_type AS ENUM ('percentage', 'fixed'); EXCEPTION WHEN duplicate_object THEN null; END $$;

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name     VARCHAR(100) NOT NULL,
  email         VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  phone         VARCHAR(20),
  is_verified   BOOLEAN DEFAULT false,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ADMINS
CREATE TABLE IF NOT EXISTS admins (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name     VARCHAR(100) NOT NULL,
  email         VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          admin_role NOT NULL DEFAULT 'support',
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100) NOT NULL,
  slug        VARCHAR(120) UNIQUE NOT NULL,
  parent_id   UUID REFERENCES categories(id),
  description TEXT,
  image_url   TEXT,
  sort_order  INTEGER DEFAULT 0,
  is_active   BOOLEAN DEFAULT true,
  created_by  UUID REFERENCES admins(id),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           VARCHAR(200) NOT NULL,
  slug           VARCHAR(220) UNIQUE NOT NULL,
  tagline        VARCHAR(250),
  description    TEXT,
  volume         VARCHAR(100),
  category_id    UUID REFERENCES categories(id),
  price          NUMERIC(10,2) NOT NULL,
  mrp            NUMERIC(10,2),
  badge          VARCHAR(50),
  img_bg         VARCHAR(20),
  notes_top      VARCHAR(200),
  notes_heart    VARCHAR(200),
  notes_base     VARCHAR(200),
  burn_time      VARCHAR(100),
  vessel         VARCHAR(150),
  is_featured    BOOLEAN DEFAULT false,
  is_bestseller  BOOLEAN DEFAULT false,
  is_active      BOOLEAN DEFAULT true,
  created_by     UUID REFERENCES admins(id),
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- PRODUCT IMAGES
CREATE TABLE IF NOT EXISTS product_images (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  alt_text    TEXT,
  is_main     BOOLEAN DEFAULT false,
  sort_order  INTEGER DEFAULT 0
);

-- PRODUCT INGREDIENTS
CREATE TABLE IF NOT EXISTS product_ingredients (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name        VARCHAR(100) NOT NULL,
  description VARCHAR(200),
  sort_order  INTEGER DEFAULT 0
);

-- INVENTORY
CREATE TABLE IF NOT EXISTS inventory (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID UNIQUE NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity    INTEGER NOT NULL DEFAULT 0,
  reserved    INTEGER DEFAULT 0,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ADDRESSES
CREATE TABLE IF NOT EXISTS addresses (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label        VARCHAR(50),
  line1        TEXT NOT NULL,
  line2        TEXT,
  city         VARCHAR(100) NOT NULL,
  state        VARCHAR(100) NOT NULL,
  postal_code  VARCHAR(20) NOT NULL,
  country      VARCHAR(100) DEFAULT 'India',
  is_default   BOOLEAN DEFAULT false
);

-- CART ITEMS
CREATE TABLE IF NOT EXISTS cart_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES products(id),
  quantity    INTEGER NOT NULL DEFAULT 1,
  added_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- COUPONS
CREATE TABLE IF NOT EXISTS coupons (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code             VARCHAR(50) UNIQUE NOT NULL,
  discount_type    discount_type NOT NULL,
  discount_value   NUMERIC(10,2) NOT NULL,
  min_order_value  NUMERIC(10,2) DEFAULT 0,
  max_uses         INTEGER,
  uses_count       INTEGER DEFAULT 0,
  valid_from       TIMESTAMPTZ,
  valid_until      TIMESTAMPTZ,
  is_active        BOOLEAN DEFAULT true,
  created_by       UUID REFERENCES admins(id),
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ORDERS
CREATE TABLE IF NOT EXISTS orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES users(id),
  address_id       UUID REFERENCES addresses(id),
  status           order_status NOT NULL DEFAULT 'pending',
  payment_method   payment_method,
  subtotal         NUMERIC(10,2) NOT NULL,
  discount_amount  NUMERIC(10,2) DEFAULT 0,
  shipping_amount  NUMERIC(10,2) DEFAULT 0,
  tax_amount       NUMERIC(10,2) DEFAULT 0,
  total_amount     NUMERIC(10,2) NOT NULL,
  notes            TEXT,
  placed_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ORDER ITEMS
CREATE TABLE IF NOT EXISTS order_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id    UUID REFERENCES products(id),
  product_name  VARCHAR(200) NOT NULL,
  volume        VARCHAR(100),
  unit_price    NUMERIC(10,2) NOT NULL,
  quantity      INTEGER NOT NULL,
  total_price   NUMERIC(10,2) NOT NULL
);

-- ORDER COUPONS
CREATE TABLE IF NOT EXISTS order_coupons (
  order_id         UUID REFERENCES orders(id),
  coupon_id        UUID REFERENCES coupons(id),
  discount_amount  NUMERIC(10,2) NOT NULL,
  PRIMARY KEY (order_id, coupon_id)
);

-- PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID NOT NULL REFERENCES orders(id),
  method          payment_method,
  status          payment_status NOT NULL DEFAULT 'pending',
  gateway         VARCHAR(50),
  gateway_txn_id  VARCHAR(200),
  amount          NUMERIC(10,2) NOT NULL,
  paid_at         TIMESTAMPTZ
);

-- SHIPPING INFO
CREATE TABLE IF NOT EXISTS shipping_info (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id         UUID NOT NULL REFERENCES orders(id),
  carrier          VARCHAR(100),
  tracking_number  VARCHAR(200),
  status           shipping_status DEFAULT 'preparing',
  estimated_date   DATE,
  shipped_at       TIMESTAMPTZ,
  delivered_at     TIMESTAMPTZ
);

-- REVIEWS
CREATE TABLE IF NOT EXISTS reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id),
  product_id  UUID NOT NULL REFERENCES products(id),
  order_id    UUID REFERENCES orders(id),
  rating      SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title       VARCHAR(150),
  body        TEXT,
  is_approved BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id),
  type        VARCHAR(50),
  title       TEXT NOT NULL,
  body        TEXT,
  is_read     BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- TICKER MESSAGES
CREATE TABLE IF NOT EXISTS ticker_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message     TEXT NOT NULL,
  is_active   BOOLEAN DEFAULT true,
  sort_order  INTEGER DEFAULT 0,
  created_by  UUID REFERENCES admins(id),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- BANNERS
CREATE TABLE IF NOT EXISTS banners (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  placement   VARCHAR(50) NOT NULL,
  img_url     TEXT NOT NULL,
  link_url    TEXT,
  alt_text    TEXT,
  heading     TEXT,
  body_text   TEXT,
  cta_text    VARCHAR(100),
  is_active   BOOLEAN DEFAULT true,
  sort_order  INTEGER DEFAULT 0,
  created_by  UUID REFERENCES admins(id),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_products_category   ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured   ON products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_products_bestseller ON products(is_bestseller) WHERE is_bestseller = true;
CREATE INDEX IF NOT EXISTS idx_cart_user           ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user         ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status       ON orders(status);

-- SEED DATA (ON CONFLICT DO NOTHING so re-runs are safe)
INSERT INTO admins (id, full_name, email, password_hash, role)
VALUES (
  gen_random_uuid(),
  'Super Admin',
  'admin@ashvi.in',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY8t3zC5kDJ6Xm2',
  'superadmin'
) ON CONFLICT (email) DO NOTHING;

INSERT INTO categories (id, name, slug, sort_order, description) VALUES
  (gen_random_uuid(), 'Signature', 'signature', 1, 'Sculptural rose, bouquet and bubble candles, hand poured one at a time.'),
  (gen_random_uuid(), 'Festive',   'festive',   2, 'Limited seasonal pieces poured in small batches for Diwali, Holi, Christmas and more.'),
  (gen_random_uuid(), 'Gift Sets', 'gifting',   3, 'Considered pairings, presented in our signature white and ribbon boxes.')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO ticker_messages (id, message, sort_order) VALUES
  (gen_random_uuid(), 'Free shipping on orders above ₹1,499',       1),
  (gen_random_uuid(), 'Hand poured in small batches, in Jaipur',     2),
  (gen_random_uuid(), 'Wedding & Diwali gifting now open',           3),
  (gen_random_uuid(), 'Sculpted candles · made one at a time',       4)
ON CONFLICT DO NOTHING;
