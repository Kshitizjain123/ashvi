const router = require('express').Router()
const db = require('../config/db')

// GET /categories
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'SELECT id, name, slug, image_url, sort_order FROM categories WHERE parent_id IS NULL AND is_active = true ORDER BY sort_order ASC'
    )
    res.json({ success: true, categories: rows })
  } catch (err) { next(err) }
})

// GET /categories/:slug
router.get('/:slug', async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'SELECT id, name, slug, image_url, description FROM categories WHERE slug = $1 AND is_active = true',
      [req.params.slug]
    )
    if (!rows[0]) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Category not found.' } })
    const category = rows[0]
    const { rows: sub } = await db.query(
      'SELECT id, name, slug, image_url FROM categories WHERE parent_id = $1 AND is_active = true ORDER BY sort_order ASC',
      [category.id]
    )
    res.json({ success: true, category: { ...category, subcategories: sub } })
  } catch (err) { next(err) }
})

module.exports = router
