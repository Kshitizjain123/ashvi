const router = require('express').Router()
const { v4: uuidv4 } = require('uuid')
const db = require('../../config/db')
const { requireAdmin } = require('../../middleware/auth')
const { AppError } = require('../../middleware/errorHandler')

router.use(requireAdmin)

// GET /admin/coupons
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM coupons ORDER BY created_at DESC')
    res.json({ success: true, coupons: rows })
  } catch (err) { next(err) }
})

// POST /admin/coupons
router.post('/', async (req, res, next) => {
  try {
    const { code, discount_type, discount_value, min_order_value, max_uses, valid_from, valid_until } = req.body
    if (!code || !discount_type || discount_value === undefined) {
      throw new AppError('code, discount_type, and discount_value are required.', 400, 'VALIDATION_ERROR')
    }
    const id = uuidv4()
    await db.query(
      `INSERT INTO coupons (id, code, discount_type, discount_value, min_order_value, max_uses, valid_from, valid_until, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [id, code.toUpperCase(), discount_type, discount_value, min_order_value || 0, max_uses || null, valid_from || null, valid_until || null, req.admin.id]
    )
    res.status(201).json({ success: true, id })
  } catch (err) { next(err) }
})

// PATCH /admin/coupons/:id
router.patch('/:id', async (req, res, next) => {
  try {
    const { discount_value, min_order_value, max_uses, valid_until, is_active } = req.body
    await db.query(
      `UPDATE coupons SET
        discount_value = COALESCE($1, discount_value),
        min_order_value = COALESCE($2, min_order_value),
        max_uses = COALESCE($3, max_uses),
        valid_until = COALESCE($4, valid_until),
        is_active = COALESCE($5, is_active)
       WHERE id = $6`,
      [discount_value, min_order_value, max_uses, valid_until, is_active, req.params.id]
    )
    res.json({ success: true })
  } catch (err) { next(err) }
})

// DELETE /admin/coupons/:id (deactivate)
router.delete('/:id', async (req, res, next) => {
  try {
    await db.query('UPDATE coupons SET is_active = false WHERE id = $1', [req.params.id])
    res.json({ success: true })
  } catch (err) { next(err) }
})

module.exports = router
