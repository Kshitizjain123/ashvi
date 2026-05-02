const router = require('express').Router()
const db = require('../../config/db')
const { requireAdmin } = require('../../middleware/auth')
const { AppError } = require('../../middleware/errorHandler')

router.use(requireAdmin)

// GET /admin/users
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query
    const offset = (page - 1) * limit
    let conditions = []
    let params = []
    let i = 1

    if (search) {
      conditions.push(`(u.email ILIKE $${i} OR u.full_name ILIKE $${i + 1})`)
      params.push(`%${search}%`, `%${search}%`)
      i += 2
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
    const { rows } = await db.query(`
      SELECT u.id, u.full_name, u.email, u.phone, u.is_active, u.is_verified, u.created_at,
             COUNT(o.id) AS order_count
      FROM users u
      LEFT JOIN orders o ON o.user_id = u.id
      ${where}
      GROUP BY u.id
      ORDER BY u.created_at DESC
      LIMIT $${i++} OFFSET $${i++}
    `, [...params, parseInt(limit), offset])
    res.json({ success: true, users: rows })
  } catch (err) { next(err) }
})

// GET /admin/users/:id
router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'SELECT id, full_name, email, phone, is_active, is_verified, created_at FROM users WHERE id = $1',
      [req.params.id]
    )
    if (!rows[0]) throw new AppError('User not found.', 404, 'NOT_FOUND')

    const { rows: orders } = await db.query(
      'SELECT id, status, total_amount, placed_at FROM orders WHERE user_id = $1 ORDER BY placed_at DESC LIMIT 10',
      [req.params.id]
    )
    res.json({ success: true, user: { ...rows[0], recent_orders: orders } })
  } catch (err) { next(err) }
})

// PATCH /admin/users/:id/status
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { is_active } = req.body
    if (is_active === undefined) throw new AppError('is_active required.', 400, 'VALIDATION_ERROR')
    await db.query('UPDATE users SET is_active = $1 WHERE id = $2', [is_active, req.params.id])
    res.json({ success: true })
  } catch (err) { next(err) }
})

module.exports = router
