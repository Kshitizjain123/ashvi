require('dotenv').config()
const path = require('path')
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const rateLimit = require('express-rate-limit')

const { errorHandler } = require('./src/middleware/errorHandler')

// Routes
const authRoutes = require('./src/routes/auth')
const userRoutes = require('./src/routes/users')
const categoryRoutes = require('./src/routes/categories')
const productRoutes = require('./src/routes/products')
const cartRoutes = require('./src/routes/cart')
const orderRoutes = require('./src/routes/orders')
const paymentRoutes = require('./src/routes/payments')
const cmsRoutes = require('./src/routes/cms')
const leadRoutes = require('./src/routes/leads')

// Admin Routes
const adminAuthRoutes = require('./src/routes/admin/auth')
const adminProductRoutes = require('./src/routes/admin/products')
const adminOrderRoutes = require('./src/routes/admin/orders')
const adminCouponRoutes = require('./src/routes/admin/coupons')
const adminUserRoutes = require('./src/routes/admin/users')
const adminReviewRoutes = require('./src/routes/admin/reviews')
const adminCmsRoutes = require('./src/routes/admin/cms')
const adminDashboardRoutes = require('./src/routes/admin/dashboard')
const adminCategoryRoutes = require('./src/routes/admin/categories')
const adminUploadRoutes = require('./src/routes/admin/upload')
const adminTestimonialRoutes = require('./src/routes/admin/testimonials')

const db = require('./src/config/db')

const app = express()

// Run any pending inline migrations on startup
;(async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        reviewer_name VARCHAR(100) NOT NULL,
        reviewer_loc  VARCHAR(100),
        rating        SMALLINT NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
        body          TEXT NOT NULL,
        is_active     BOOLEAN DEFAULT true,
        sort_order    INTEGER DEFAULT 0,
        created_at    TIMESTAMPTZ DEFAULT NOW()
      )
    `)
    // Seed default testimonials if table is empty
    const { rows } = await db.query('SELECT COUNT(*) FROM testimonials')
    if (parseInt(rows[0].count) === 0) {
      await db.query(`
        INSERT INTO testimonials (reviewer_name, reviewer_loc, rating, body, sort_order) VALUES
          ($1,$2,5,$3,0), ($4,$5,5,$6,1), ($7,$8,5,$9,2)
      `, [
        'Aanya R.', 'Jaipur', 'The Rose Bouquet arrived wrapped like a real bouquet. I almost didn\'t want to light it, but when I did, the throw was gentle, never overpowering.',
        'Vikram S.', 'Bengaluru', 'Ordered the Kulhad pair as a housewarming gift. The terracotta detail is so thoughtful, and the rose petals on top make it feel like a real ritual.',
        'Meera K.', 'Delhi', 'The Diwali diya candle was the most photographed thing on our table this year. The sculpted rose looks unreal in person.',
      ])
    }
    await db.query(`
      CREATE TABLE IF NOT EXISTS checkout_leads (
        id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        full_name        VARCHAR(100) NOT NULL,
        phone            VARCHAR(20) NOT NULL UNIQUE,
        address          TEXT NOT NULL,
        status           VARCHAR(50) NOT NULL DEFAULT 'order_initiated',
        items            JSONB NOT NULL DEFAULT '[]'::jsonb,
        subtotal         NUMERIC(10,2) DEFAULT 0,
        shipping_amount  NUMERIC(10,2) DEFAULT 0,
        total_amount     NUMERIC(10,2) DEFAULT 0,
        whatsapp_message TEXT,
        source           VARCHAR(50) DEFAULT 'checkout_whatsapp',
        created_at       TIMESTAMPTZ DEFAULT NOW(),
        updated_at       TIMESTAMPTZ DEFAULT NOW()
      )
    `)
    await db.query('CREATE INDEX IF NOT EXISTS idx_checkout_leads_status ON checkout_leads(status)')
    await db.query('CREATE INDEX IF NOT EXISTS idx_checkout_leads_created ON checkout_leads(created_at DESC)')
    console.log('Startup migrations OK')
  } catch (err) {
    console.error('Startup migration error:', err.message)
  }
})()

app.use(helmet())
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'https://ashviflavoursofelegance.com',
    'https://www.ashviflavoursofelegance.com',
    'http://localhost:8080',
    'http://localhost:8081',
    'http://localhost:5173',
  ].filter(Boolean),
  credentials: true,
}))

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 })
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })
app.use(limiter)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get('/health', (req, res) => res.json({ status: 'ok', version: '1.0.0' }))
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Public routes
app.use('/v1/auth', authLimiter, authRoutes)
app.use('/v1/categories', categoryRoutes)
app.use('/v1/products', productRoutes)
app.use('/v1/cms', cmsRoutes)
app.use('/v1/payments', paymentRoutes)
app.use('/v1/leads', leadRoutes)

// Authenticated user routes
app.use('/v1/users', userRoutes)
app.use('/v1/cart', cartRoutes)
app.use('/v1/orders', orderRoutes)

// Admin routes
app.use('/v1/admin/auth', authLimiter, adminAuthRoutes)
app.use('/v1/admin/products', adminProductRoutes)
app.use('/v1/admin/inventory', adminProductRoutes)
app.use('/v1/admin/orders', adminOrderRoutes)
app.use('/v1/admin/coupons', adminCouponRoutes)
app.use('/v1/admin/users', adminUserRoutes)
app.use('/v1/admin/reviews', adminReviewRoutes)
app.use('/v1/admin/cms', adminCmsRoutes)
app.use('/v1/admin/dashboard', adminDashboardRoutes)
app.use('/v1/admin/categories', adminCategoryRoutes)
app.use('/v1/admin/upload', adminUploadRoutes)
app.use('/v1/admin/testimonials', adminTestimonialRoutes)

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Ashvi backend running on port ${PORT}`)
})
