const router = require('express').Router()
const { v4: uuidv4 } = require('uuid')
const db = require('../config/db')
const { AppError } = require('../middleware/errorHandler')

// POST /payments/initiate
router.post('/initiate', async (req, res, next) => {
  try {
    const { order_id, method } = req.body
    if (!order_id || !method) throw new AppError('order_id and method required.', 400, 'VALIDATION_ERROR')

    const { rows } = await db.query('SELECT id, total_amount FROM orders WHERE id = $1', [order_id])
    if (!rows[0]) throw new AppError('Order not found.', 404, 'NOT_FOUND')

    const paymentId = uuidv4()
    await db.query(
      'INSERT INTO payments (id, order_id, method, status, amount) VALUES ($1,$2,$3,\'pending\',$4)',
      [paymentId, order_id, method, rows[0].total_amount]
    )

    // In production: create Razorpay order and return gateway data
    res.json({ success: true, payment_id: paymentId, amount: rows[0].total_amount })
  } catch (err) { next(err) }
})

// POST /payments/webhook — Razorpay webhook
router.post('/webhook', async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body
    // In production: verify signature with RAZORPAY_KEY_SECRET
    // For now, mark payment as success
    res.json({ success: true })
  } catch (err) { next(err) }
})

// GET /payments/:orderId
router.get('/:orderId', async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM payments WHERE order_id = $1', [req.params.orderId])
    res.json({ success: true, payment: rows[0] || null })
  } catch (err) { next(err) }
})

module.exports = router
