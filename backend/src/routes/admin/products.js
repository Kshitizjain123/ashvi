const router = require('express').Router()
const { v4: uuidv4 } = require('uuid')
const db = require('../../config/db')
const { requireAdmin } = require('../../middleware/auth')
const { AppError } = require('../../middleware/errorHandler')

router.use(requireAdmin)

// GET /admin/products
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query
    const offset = (page - 1) * limit
    let conditions = []
    let params = []
    let i = 1

    if (search) { conditions.push(`p.name ILIKE $${i++}`); params.push(`%${search}%`) }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
    const { rows } = await db.query(`
      SELECT p.id, p.name, p.slug, p.tagline, p.volume, p.description,
             p.price, p.mrp, p.badge, p.img_bg,
             p.notes_top, p.notes_heart, p.notes_base, p.burn_time, p.vessel,
             p.is_featured, p.is_bestseller, p.is_active,
             p.category_id, c.name AS category_name,
             pi.url AS img_src,
             COALESCE(inv.quantity, 0) AS stock
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_main = true
      LEFT JOIN inventory inv ON inv.product_id = p.id
      ${where}
      ORDER BY p.created_at DESC
      LIMIT $${i++} OFFSET $${i++}
    `, [...params, parseInt(limit), offset])
    res.json({ success: true, products: rows })
  } catch (err) { next(err) }
})

// POST /admin/products
router.post('/', async (req, res, next) => {
  try {
    const {
      name, tagline, description, volume, category_id, price, mrp, badge, img_bg,
      notes_top, notes_heart, notes_base, burn_time, vessel,
      is_featured, is_bestseller
    } = req.body
    if (!name || !price) throw new AppError('name and price are required.', 400, 'VALIDATION_ERROR')

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now()
    const id = uuidv4()
    await db.query(
      `INSERT INTO products (id, name, slug, tagline, description, volume, category_id, price, mrp, badge, img_bg,
         notes_top, notes_heart, notes_base, burn_time, vessel, is_featured, is_bestseller, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)`,
      [id, name, slug, tagline, description, volume, category_id, price, mrp, badge, img_bg,
       notes_top, notes_heart, notes_base, burn_time, vessel,
       is_featured || false, is_bestseller || false, req.admin.id]
    )
    await db.query('INSERT INTO inventory (id, product_id, quantity) VALUES ($1,$2,0)', [uuidv4(), id])
    res.status(201).json({ success: true, id, slug })
  } catch (err) { next(err) }
})

// PATCH /admin/products/:id
router.patch('/:id', async (req, res, next) => {
  try {
    const fields = [
      'name', 'tagline', 'description', 'volume', 'category_id', 'price', 'mrp', 'badge', 'img_bg',
      'notes_top', 'notes_heart', 'notes_base', 'burn_time', 'vessel',
      'is_featured', 'is_bestseller', 'is_active'
    ]
    const updates = []
    const values = []
    let i = 1
    for (const field of fields) {
      if (req.body[field] !== undefined) {
        updates.push(`${field} = $${i++}`)
        values.push(req.body[field])
      }
    }
    if (!updates.length) throw new AppError('No fields to update.', 400, 'VALIDATION_ERROR')
    updates.push('updated_at = NOW()')
    values.push(req.params.id)
    await db.query(`UPDATE products SET ${updates.join(', ')} WHERE id = $${i}`, values)
    res.json({ success: true })
  } catch (err) { next(err) }
})

// DELETE /admin/products/:id (soft delete)
router.delete('/:id', async (req, res, next) => {
  try {
    await db.query('UPDATE products SET is_active = false, updated_at = NOW() WHERE id = $1', [req.params.id])
    res.json({ success: true })
  } catch (err) { next(err) }
})

// POST /admin/products/:id/images
router.post('/:id/images', async (req, res, next) => {
  try {
    const { url, alt_text, is_main, sort_order } = req.body
    if (!url) throw new AppError('url required.', 400, 'VALIDATION_ERROR')
    if (is_main) {
      await db.query('UPDATE product_images SET is_main = false WHERE product_id = $1', [req.params.id])
    }
    const id = uuidv4()
    await db.query(
      'INSERT INTO product_images (id, product_id, url, alt_text, is_main, sort_order) VALUES ($1,$2,$3,$4,$5,$6)',
      [id, req.params.id, url, alt_text, is_main || false, sort_order || 0]
    )
    res.status(201).json({ success: true, id })
  } catch (err) { next(err) }
})

// DELETE /admin/products/:id/images/:imgId
router.delete('/:id/images/:imgId', async (req, res, next) => {
  try {
    await db.query('DELETE FROM product_images WHERE id = $1 AND product_id = $2', [req.params.imgId, req.params.id])
    res.json({ success: true })
  } catch (err) { next(err) }
})

// PATCH /admin/products/:id/ingredients
router.patch('/:id/ingredients', async (req, res, next) => {
  try {
    const { ingredients } = req.body // [{ name, description, sort_order }]
    await db.query('DELETE FROM product_ingredients WHERE product_id = $1', [req.params.id])
    for (const ing of (ingredients || [])) {
      await db.query(
        'INSERT INTO product_ingredients (id, product_id, name, description, sort_order) VALUES ($1,$2,$3,$4,$5)',
        [uuidv4(), req.params.id, ing.name, ing.description, ing.sort_order || 0]
      )
    }
    res.json({ success: true })
  } catch (err) { next(err) }
})

// PATCH /admin/inventory/:productId
router.patch('/inventory/:productId', async (req, res, next) => {
  try {
    const { quantity } = req.body
    if (quantity === undefined) throw new AppError('quantity required.', 400, 'VALIDATION_ERROR')
    await db.query(
      'INSERT INTO inventory (id, product_id, quantity) VALUES ($1,$2,$3) ON CONFLICT (product_id) DO UPDATE SET quantity = $3, updated_at = NOW()',
      [uuidv4(), req.params.productId, quantity]
    )
    res.json({ success: true })
  } catch (err) { next(err) }
})

module.exports = router
