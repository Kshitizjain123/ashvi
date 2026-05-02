require('dotenv').config()
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

const app = express()

app.use(helmet())
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'https://kshitizjain123.github.io',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    'http://localhost:5177',
  ],
  credentials: true,
}))

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 })
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })
app.use(limiter)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get('/health', (req, res) => res.json({ status: 'ok', version: '1.0.0' }))

// Public routes
app.use('/v1/auth', authLimiter, authRoutes)
app.use('/v1/categories', categoryRoutes)
app.use('/v1/products', productRoutes)
app.use('/v1/cms', cmsRoutes)
app.use('/v1/payments', paymentRoutes)

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

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Ashvi backend running on port ${PORT}`)
})
