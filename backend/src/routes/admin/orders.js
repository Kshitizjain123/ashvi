const router = require('express').Router()
const { v4: uuidv4 } = require('uuid')
const db = require('../../config/db')
const { requireAdmin } = require('../../middleware/auth')
const { AppError } = require('../../middleware/errorHandler')

router.use(requireAdmin)

// GET /admin/orders
router.get('/', async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query
    const offset = (page - 1) * limit
    let conditions = []
    let params = []
    let i = 1

    if (status) { conditions.push(`o.status = $${i++}`); params.push(status) }
    if (search) {
      conditions.push(`(u.email ILIKE $${i} OR o.id::text ILIKE $${i + 1})`)
      params.push(`%${search}%`, `%${search}%`)
      i += 2
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
    const { rows } = await db.query(`
      SELECT o.id, o.status, o.subtotal, o.total_amount, o.placed_at,
             u.full_name AS customer_name, u.email AS customer_email,
             COUNT(oi.id) AS item_count
      FROM orders o
      JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON oi.order_id = o.id
      ${where}
      GROUP BY o.id, u.full_name, u.email
      ORDER BY o.placed_at DESC
      LIMIT $${i++} OFFSET $${i++}
    `, [...params, parseInt(limit), offset])
    res.json({ success: true, orders: rows })
  } catch (err) { next(err) }
})

// GET /admin/orders/:id
router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await db.query(`
      SELECT o.*, u.full_name AS customer_name, u.email AS customer_email, u.phone AS customer_phone,
             a.line1, a.line2, a.city, a.state, a.postal_code
      FROM orders o
      JOIN users u ON o.user_id = u.id
      LEFT JOIN addresses a ON o.address_id = a.id
      WHERE o.id = $1
    `, [req.params.id])
    if (!rows[0]) throw new AppError('Order not found.', 404, 'NOT_FOUND')

    const { rows: items } = await db.query('SELECT * FROM order_items WHERE order_id = $1', [req.params.id])
    const { rows: shipping } = await db.query('SELECT * FROM shipping_info WHERE order_id = $1', [req.params.id])
    const { rows: payment } = await db.query('SELECT * FROM payments WHERE order_id = $1', [req.params.id])

    res.json({ success: true, order: { ...rows[0], items, shipping: shipping[0] || null, payment: payment[0] || null } })
  } catch (err) { next(err) }
})

// PATCH /admin/orders/:id/status
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body
    const valid = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned']
    if (!valid.includes(status)) throw new AppError('Invalid status.', 400, 'VALIDATION_ERROR')
    await db.query('UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2', [status, req.params.id])

    const { rows } = await db.query('SELECT user_id FROM orders WHERE id = $1', [req.params.id])
    if (rows[0]) {
      await db.query(
        "INSERT INTO notifications (id, user_id, type, title, body) VALUES ($1,$2,'order_update',$3,$4)",
        [uuidv4(), rows[0].user_id, `Order ${status}`, `Your order status has been updated to ${status}.`]
      )
    }
    res.json({ success: true })
  } catch (err) { next(err) }
})

// POST /admin/orders/:id/shipping
router.post('/:id/shipping', async (req, res, next) => {
  try {
    const { carrier, tracking_number, estimated_date } = req.body
    const existing = await db.query('SELECT id FROM shipping_info WHERE order_id = $1', [req.params.id])
    if (existing.rows[0]) {
      await db.query(
        "UPDATE shipping_info SET carrier = $1, tracking_number = $2, estimated_date = $3, status = 'dispatched', shipped_at = NOW() WHERE order_id = $4",
        [carrier, tracking_number, estimated_date, req.params.id]
      )
    } else {
      await db.query(
        "INSERT INTO shipping_info (id, order_id, carrier, tracking_number, estimated_date, status, shipped_at) VALUES ($1,$2,$3,$4,$5,'dispatched',NOW())",
        [uuidv4(), req.params.id, carrier, tracking_number, estimated_date]
      )
    }
    await db.query("UPDATE orders SET status = 'shipped', updated_at = NOW() WHERE id = $1", [req.params.id])
    res.json({ success: true })
  } catch (err) { next(err) }
})

// POST /admin/orders/:id/refund
router.post('/:id/refund', async (req, res, next) => {
  try {
    await db.query("UPDATE payments SET status = 'refunded' WHERE order_id = $1", [req.params.id])
    await db.query("UPDATE orders SET status = 'returned', updated_at = NOW() WHERE id = $1", [req.params.id])
    res.json({ success: true })
  } catch (err) { next(err) }
})

module.exports = router
