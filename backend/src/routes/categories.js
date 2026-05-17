const router = require('express').Router()
const db = require('../config/db')
const { ensureDefaultCategories } = require('../lib/defaultCategories')

// GET /categories
router.get('/', async (req, res, next) => {
  try {
    await ensureDefaultCategories(db)
    const { rows } = await db.query(
      `SELECT id, name, slug, parent_id, image_url, description, sort_order
       FROM categories
       WHERE is_active = true
       ORDER BY sort_order ASC, name ASC`
    )
    const byId = new Map(rows.map((row) => [row.id, { ...row, subcategories: [] }]))
    const categories = []
    byId.forEach((category) => {
      if (category.parent_id && byId.has(category.parent_id)) {
        byId.get(category.parent_id).subcategories.push(category)
      } else {
        categories.push(category)
      }
    })
    res.json({ success: true, categories })
  } catch (err) { next(err) }
})

// GET /categories/:slug
router.get('/:slug', async (req, res, next) => {
  try {
    await ensureDefaultCategories(db)
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
