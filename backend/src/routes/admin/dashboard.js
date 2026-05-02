const router = require('express').Router()
const db = require('../../config/db')
const { requireAdmin } = require('../../middleware/auth')

router.use(requireAdmin)

// GET /admin/dashboard/summary
router.get('/summary', async (req, res, next) => {
  try {
    const [revenue, orders, users, products, recentOrders] = await Promise.all([
      db.query(`SELECT COALESCE(SUM(total_amount), 0) AS total FROM orders WHERE status NOT IN ('cancelled', 'returned')`),
      db.query(`SELECT COUNT(*) AS total FROM orders`),
      db.query(`SELECT COUNT(*) AS total FROM users`),
      db.query(`SELECT COUNT(*) AS total FROM products WHERE is_active = true`),
      db.query(`
        SELECT o.id, o.status, o.total_amount, o.placed_at, u.full_name AS customer_name
        FROM orders o JOIN users u ON o.user_id = u.id
        ORDER BY o.placed_at DESC LIMIT 5
      `),
    ])

    res.json({
      success: true,
      summary: {
        total_revenue: parseFloat(revenue.rows[0].total).toFixed(2),
        total_orders: parseInt(orders.rows[0].total),
        total_users: parseInt(users.rows[0].total),
        total_products: parseInt(products.rows[0].total),
      },
      recent_orders: recentOrders.rows,
    })
  } catch (err) { next(err) }
})

// GET /admin/dashboard/top-products
router.get('/top-products', async (req, res, next) => {
  try {
    const { rows } = await db.query(`
      SELECT p.id, p.name, p.price,
             SUM(oi.quantity) AS units_sold,
             SUM(oi.total_price) AS revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status NOT IN ('cancelled', 'returned')
      GROUP BY p.id, p.name, p.price
      ORDER BY revenue DESC
      LIMIT 10
    `)
    res.json({ success: true, top_products: rows })
  } catch (err) { next(err) }
})

module.exports = router
