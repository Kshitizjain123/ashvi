const router = require('express').Router()
const { v4: uuidv4 } = require('uuid')
const db = require('../config/db')
const { requireUser } = require('../middleware/auth')
const { AppError } = require('../middleware/errorHandler')

const FREE_SHIPPING_THRESHOLD = 1499

// POST /orders/apply-coupon
router.post('/apply-coupon', requireUser, async (req, res, next) => {
  try {
    const { coupon_code, subtotal } = req.body
    if (!coupon_code) throw new AppError('coupon_code required.', 400, 'VALIDATION_ERROR')

    const { rows } = await db.query(
      `SELECT * FROM coupons WHERE code = $1 AND is_active = true
       AND (valid_from IS NULL OR valid_from <= NOW())
       AND (valid_until IS NULL OR valid_until >= NOW())`,
      [coupon_code.toUpperCase()]
    )
    const coupon = rows[0]
    if (!coupon) throw new AppError('Coupon is invalid or expired.', 422, 'COUPON_INVALID')
    if (coupon.max_uses && coupon.uses_count >= coupon.max_uses) {
      throw new AppError('Coupon usage limit reached.', 422, 'COUPON_INVALID')
    }
    if (subtotal && parseFloat(subtotal) < parseFloat(coupon.min_order_value)) {
      throw new AppError(`Minimum order ₹${coupon.min_order_value} required.`, 422, 'COUPON_INVALID')
    }

    const discount = coupon.discount_type === 'percentage'
      ? (parseFloat(subtotal || 0) * parseFloat(coupon.discount_value) / 100)
      : parseFloat(coupon.discount_value)

    res.json({ success: true, coupon_id: coupon.id, discount_amount: discount.toFixed(2) })
  } catch (err) { next(err) }
})

// POST /orders
router.post('/', requireUser, async (req, res, next) => {
  try {
    const { address_id, payment_method, coupon_code, notes } = req.body
    if (!address_id || !payment_method) {
      throw new AppError('address_id and payment_method required.', 400, 'VALIDATION_ERROR')
    }

    const { rows: cartItems } = await db.query(`
      SELECT ci.product_id, ci.quantity, p.price, p.name, p.volume,
             COALESCE(inv.quantity - inv.reserved, 0) AS available
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      LEFT JOIN inventory inv ON inv.product_id = p.id
      WHERE ci.user_id = $1
    `, [req.user.id])

    if (!cartItems.length) throw new AppError('Cart is empty.', 400, 'VALIDATION_ERROR')

    for (const item of cartItems) {
      if (item.available < item.quantity) {
        throw new AppError(`${item.name} is out of stock.`, 410, 'OUT_OF_STOCK')
      }
    }

    const subtotal = cartItems.reduce((s, i) => s + parseFloat(i.price) * i.quantity, 0)
    let discountAmount = 0
    let couponId = null

    if (coupon_code) {
      const { rows: cr } = await db.query(
        'SELECT * FROM coupons WHERE code = $1 AND is_active = true', [coupon_code.toUpperCase()]
      )
      if (cr[0]) {
        couponId = cr[0].id
        discountAmount = cr[0].discount_type === 'percentage'
          ? subtotal * parseFloat(cr[0].discount_value) / 100
          : parseFloat(cr[0].discount_value)
      }
    }

    const shippingAmount = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 99
    const totalAmount = subtotal - discountAmount + shippingAmount

    const orderId = uuidv4()
    await db.query(
      `INSERT INTO orders (id, user_id, address_id, status, subtotal, discount_amount, shipping_amount, total_amount, payment_method, notes)
       VALUES ($1,$2,$3,'pending',$4,$5,$6,$7,$8,$9)`,
      [orderId, req.user.id, address_id, subtotal.toFixed(2), discountAmount.toFixed(2), shippingAmount.toFixed(2), totalAmount.toFixed(2), payment_method, notes || null]
    )

    for (const item of cartItems) {
      await db.query(
        `INSERT INTO order_items (id, order_id, product_id, product_name, volume, unit_price, quantity, total_price)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [uuidv4(), orderId, item.product_id, item.name, item.volume, item.price, item.quantity, (parseFloat(item.price) * item.quantity).toFixed(2)]
      )
      await db.query('UPDATE inventory SET reserved = reserved + $1 WHERE product_id = $2', [item.quantity, item.product_id])
    }

    if (couponId) {
      await db.query('INSERT INTO order_coupons (order_id, coupon_id, discount_amount) VALUES ($1,$2,$3)', [orderId, couponId, discountAmount.toFixed(2)])
      await db.query('UPDATE coupons SET uses_count = uses_count + 1 WHERE id = $1', [couponId])
    }

    await db.query('DELETE FROM cart_items WHERE user_id = $1', [req.user.id])

    res.status(201).json({ success: true, order_id: orderId, total_amount: totalAmount.toFixed(2) })
  } catch (err) { next(err) }
})

// GET /orders
router.get('/', requireUser, async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'SELECT id, status, total_amount, placed_at FROM orders WHERE user_id = $1 ORDER BY placed_at DESC',
      [req.user.id]
    )
    res.json({ success: true, orders: rows })
  } catch (err) { next(err) }
})

// GET /orders/:id
router.get('/:id', requireUser, async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM orders WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id])
    if (!rows[0]) throw new AppError('Order not found.', 404, 'NOT_FOUND')
    const order = rows[0]
    const { rows: items } = await db.query('SELECT * FROM order_items WHERE order_id = $1', [order.id])
    res.json({ success: true, order: { ...order, items } })
  } catch (err) { next(err) }
})

// POST /orders/:id/cancel
router.post('/:id/cancel', requireUser, async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM orders WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id])
    if (!rows[0]) throw new AppError('Order not found.', 404, 'NOT_FOUND')
    if (!['pending', 'confirmed'].includes(rows[0].status)) {
      throw new AppError('Order cannot be cancelled at this stage.', 400, 'VALIDATION_ERROR')
    }
    await db.query("UPDATE orders SET status = 'cancelled', updated_at = NOW() WHERE id = $1", [req.params.id])
    res.json({ success: true })
  } catch (err) { next(err) }
})

// GET /orders/:id/tracking
router.get('/:id/tracking', requireUser, async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM shipping_info WHERE order_id = $1', [req.params.id])
    res.json({ success: true, tracking: rows[0] || null })
  } catch (err) { next(err) }
})

module.exports = router
