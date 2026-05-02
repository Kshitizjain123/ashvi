const router = require('express').Router()
const db = require('../../config/db')
const { requireAdmin } = require('../../middleware/auth')

router.use(requireAdmin)

// GET /admin/reviews
router.get('/', async (req, res, next) => {
  try {
    const { approved } = req.query
    let query = `
      SELECT r.id, r.rating, r.title, r.body, r.is_approved, r.created_at,
             u.full_name AS user_name, p.name AS product_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      JOIN products p ON r.product_id = p.id
    `
    const params = []
    if (approved !== undefined) {
      query += ` WHERE r.is_approved = $1`
      params.push(approved === 'true')
    }
    query += ' ORDER BY r.created_at DESC'
    const { rows } = await db.query(query, params)
    res.json({ success: true, reviews: rows })
  } catch (err) { next(err) }
})

// PATCH /admin/reviews/:id/approve
router.patch('/:id/approve', async (req, res, next) => {
  try {
    await db.query('UPDATE reviews SET is_approved = true WHERE id = $1', [req.params.id])
    res.json({ success: true })
  } catch (err) { next(err) }
})

// DELETE /admin/reviews/:id
router.delete('/:id', async (req, res, next) => {
  try {
    await db.query('DELETE FROM reviews WHERE id = $1', [req.params.id])
    res.json({ success: true })
  } catch (err) { next(err) }
})

module.exports = router
