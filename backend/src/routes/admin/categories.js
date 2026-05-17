const router = require('express').Router()
const { v4: uuidv4 } = require('uuid')
const db = require('../../config/db')
const { requireAdmin } = require('../../middleware/auth')
const { AppError } = require('../../middleware/errorHandler')

router.use(requireAdmin)

// GET /admin/categories
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM categories ORDER BY sort_order ASC')
    res.json({ success: true, categories: rows })
  } catch (err) { next(err) }
})

// POST /admin/categories
router.post('/', async (req, res, next) => {
  try {
    const { name, parent_id, image_url, sort_order, description } = req.body
    if (!name) throw new AppError('name required.', 400, 'VALIDATION_ERROR')
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const id = uuidv4()
    await db.query(
      'INSERT INTO categories (id, name, slug, parent_id, image_url, sort_order, description, created_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
      [id, name, slug, parent_id || null, image_url, sort_order || 0, description, req.admin.id]
    )
    res.status(201).json({ success: true, id, slug })
  } catch (err) { next(err) }
})

// PATCH /admin/categories/:id
router.patch('/:id', async (req, res, next) => {
  try {
    const { name, parent_id, image_url, sort_order, is_active, description } = req.body
    if (parent_id === req.params.id) {
      throw new AppError('A category cannot be its own parent.', 400, 'VALIDATION_ERROR')
    }
    const hasParent = Object.prototype.hasOwnProperty.call(req.body, 'parent_id')
    await db.query(
      `UPDATE categories SET
        name = COALESCE($1, name),
        parent_id = CASE WHEN $2 THEN $3 ELSE parent_id END,
        image_url = COALESCE($4, image_url),
        sort_order = COALESCE($5, sort_order),
        is_active = COALESCE($6, is_active),
        description = COALESCE($7, description)
       WHERE id = $8`,
      [name, hasParent, parent_id || null, image_url, sort_order, is_active, description, req.params.id]
    )
    res.json({ success: true })
  } catch (err) { next(err) }
})

// DELETE /admin/categories/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT COUNT(*) FROM products WHERE category_id = $1 AND is_active = true', [req.params.id])
    if (parseInt(rows[0].count) > 0) {
      throw new AppError('Cannot delete a category that has active products. Deactivate its products first.', 400, 'VALIDATION_ERROR')
    }
    const { rows: childRows } = await db.query('SELECT COUNT(*) FROM categories WHERE parent_id = $1', [req.params.id])
    if (parseInt(childRows[0].count) > 0) {
      throw new AppError('Cannot delete a category that has subcategories. Move or delete its subcategories first.', 400, 'VALIDATION_ERROR')
    }
    await db.query('DELETE FROM categories WHERE id = $1', [req.params.id])
    res.json({ success: true })
  } catch (err) { next(err) }
})

module.exports = router
