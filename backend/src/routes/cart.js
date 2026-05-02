const router = require('express').Router()
const { v4: uuidv4 } = require('uuid')
const db = require('../config/db')
const { requireUser } = require('../middleware/auth')
const { AppError } = require('../middleware/errorHandler')

const FREE_SHIPPING_THRESHOLD = 1499

const getCartData = async (userId) => {
  const { rows } = await db.query(`
    SELECT ci.product_id AS id, p.name, p.volume AS subtitle,
           p.price::text, pi.url AS "imgSrc", ci.quantity AS qty
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_main = true
    WHERE ci.user_id = $1
  `, [userId])

  const subtotal = rows.reduce((sum, item) => sum + parseFloat(item.price) * item.qty, 0)
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 99
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)

  return {
    items: rows,
    subtotal: subtotal.toFixed(2),
    shipping: shipping.toFixed(2),
    free_shipping_threshold: FREE_SHIPPING_THRESHOLD.toFixed(2),
    free_shipping_remaining: remaining.toFixed(2),
  }
}

// GET /cart
router.get('/', requireUser, async (req, res, next) => {
  try {
    const cart = await getCartData(req.user.id)
    res.json({ success: true, ...cart })
  } catch (err) { next(err) }
})

// POST /cart/items
router.post('/items', requireUser, async (req, res, next) => {
  try {
    const { product_id, quantity = 1 } = req.body
    if (!product_id) throw new AppError('product_id required.', 400, 'VALIDATION_ERROR')

    const existing = await db.query(
      'SELECT id, quantity FROM cart_items WHERE user_id = $1 AND product_id = $2',
      [req.user.id, product_id]
    )
    if (existing.rows[0]) {
      await db.query(
        'UPDATE cart_items SET quantity = quantity + $1 WHERE id = $2',
        [quantity, existing.rows[0].id]
      )
    } else {
      await db.query(
        'INSERT INTO cart_items (id, user_id, product_id, quantity) VALUES ($1,$2,$3,$4)',
        [uuidv4(), req.user.id, product_id, quantity]
      )
    }
    const cart = await getCartData(req.user.id)
    res.json({ success: true, ...cart })
  } catch (err) { next(err) }
})

// PATCH /cart/items/:productId
router.patch('/items/:productId', requireUser, async (req, res, next) => {
  try {
    const { quantity } = req.body
    if (!quantity || quantity < 1) throw new AppError('Quantity must be >= 1.', 400, 'VALIDATION_ERROR')
    await db.query(
      'UPDATE cart_items SET quantity = $1 WHERE user_id = $2 AND product_id = $3',
      [quantity, req.user.id, req.params.productId]
    )
    const cart = await getCartData(req.user.id)
    res.json({ success: true, ...cart })
  } catch (err) { next(err) }
})

// DELETE /cart/items/:productId
router.delete('/items/:productId', requireUser, async (req, res, next) => {
  try {
    await db.query('DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2', [req.user.id, req.params.productId])
    const cart = await getCartData(req.user.id)
    res.json({ success: true, ...cart })
  } catch (err) { next(err) }
})

// DELETE /cart
router.delete('/', requireUser, async (req, res, next) => {
  try {
    await db.query('DELETE FROM cart_items WHERE user_id = $1', [req.user.id])
    res.json({ success: true })
  } catch (err) { next(err) }
})

// POST /cart/merge — merge guest cart on login
router.post('/merge', requireUser, async (req, res, next) => {
  try {
    const { items } = req.body
    if (!Array.isArray(items)) throw new AppError('items must be an array.', 400, 'VALIDATION_ERROR')

    for (const item of items) {
      if (!item.product_id || !item.quantity) continue
      const existing = await db.query(
        'SELECT id, quantity FROM cart_items WHERE user_id = $1 AND product_id = $2',
        [req.user.id, item.product_id]
      )
      if (existing.rows[0]) {
        await db.query(
          'UPDATE cart_items SET quantity = quantity + $1 WHERE id = $2',
          [item.quantity, existing.rows[0].id]
        )
      } else {
        await db.query(
          'INSERT INTO cart_items (id, user_id, product_id, quantity) VALUES ($1,$2,$3,$4)',
          [uuidv4(), req.user.id, item.product_id, item.quantity]
        )
      }
    }
    const cart = await getCartData(req.user.id)
    res.json({ success: true, ...cart })
  } catch (err) { next(err) }
})

module.exports = router
