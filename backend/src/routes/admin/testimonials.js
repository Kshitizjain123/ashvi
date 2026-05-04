const router = require('express').Router()
const { v4: uuidv4 } = require('uuid')
const db = require('../../config/db')
const { requireAdmin } = require('../../middleware/auth')

router.use(requireAdmin)

// GET /admin/testimonials
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM testimonials ORDER BY sort_order ASC, created_at DESC'
    )
    res.json({ success: true, testimonials: rows })
  } catch (err) { next(err) }
})

// POST /admin/testimonials
router.post('/', async (req, res, next) => {
  try {
    const { reviewer_name, reviewer_loc, rating, body, sort_order } = req.body
    if (!reviewer_name || !body) {
      return res.status(400).json({ success: false, error: { message: 'reviewer_name and body are required' } })
    }
    const id = uuidv4()
    await db.query(
      'INSERT INTO testimonials (id, reviewer_name, reviewer_loc, rating, body, sort_order) VALUES ($1,$2,$3,$4,$5,$6)',
      [id, reviewer_name, reviewer_loc || null, rating || 5, body, sort_order || 0]
    )
    res.status(201).json({ success: true, id })
  } catch (err) { next(err) }
})

// PATCH /admin/testimonials/:id
router.patch('/:id', async (req, res, next) => {
  try {
    const { reviewer_name, reviewer_loc, rating, body, is_active, sort_order } = req.body
    await db.query(
      `UPDATE testimonials SET
        reviewer_name = COALESCE($1, reviewer_name),
        reviewer_loc  = COALESCE($2, reviewer_loc),
        rating        = COALESCE($3, rating),
        body          = COALESCE($4, body),
        is_active     = COALESCE($5, is_active),
        sort_order    = COALESCE($6, sort_order)
       WHERE id = $7`,
      [reviewer_name, reviewer_loc, rating, body, is_active, sort_order, req.params.id]
    )
    res.json({ success: true })
  } catch (err) { next(err) }
})

// DELETE /admin/testimonials/:id
router.delete('/:id', async (req, res, next) => {
  try {
    await db.query('DELETE FROM testimonials WHERE id = $1', [req.params.id])
    res.json({ success: true })
  } catch (err) { next(err) }
})

module.exports = router
