const router = require('express').Router()
const db = require('../config/db')
const { requireUser } = require('../middleware/auth')
const { AppError } = require('../middleware/errorHandler')
const { v4: uuidv4 } = require('uuid')

const formatProduct = (row) => ({
  id: row.id,
  slug: row.slug,
  name: row.name,
  tagline: row.tagline,
  volume: row.volume,
  price: parseFloat(row.price).toFixed(2),
  mrp: row.mrp ? parseFloat(row.mrp).toFixed(2) : null,
  badge: row.badge || null,
  imgSrc: row.img_src || '',
  imgBg: row.img_bg || '#fdf8f2',
})

// GET /products
router.get('/', async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, sort, page = 1, limit = 20, search } = req.query
    let conditions = ['p.is_active = true']
    let params = []
    let i = 1

    if (category) { conditions.push(`c.slug = $${i++}`); params.push(category) }
    if (minPrice) { conditions.push(`p.price >= $${i++}`); params.push(minPrice) }
    if (maxPrice) { conditions.push(`p.price <= $${i++}`); params.push(maxPrice) }
    if (search) { conditions.push(`p.name ILIKE $${i++}`); params.push(`%${search}%`) }

    const sortMap = {
      price_asc: 'p.price ASC',
      price_desc: 'p.price DESC',
      newest: 'p.created_at DESC',
    }
    const orderBy = sortMap[sort] || 'p.created_at DESC'
    const offset = (page - 1) * limit

    const query = `
      SELECT p.id, p.slug, p.name, p.tagline, p.volume, p.price, p.mrp, p.badge, p.img_bg,
             pi.url AS img_src
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_main = true
      WHERE ${conditions.join(' AND ')}
      ORDER BY ${orderBy}
      LIMIT $${i++} OFFSET $${i++}
    `
    params.push(parseInt(limit), offset)
    const { rows } = await db.query(query, params)
    res.json({ success: true, products: rows.map(formatProduct) })
  } catch (err) { next(err) }
})

// GET /products/featured
router.get('/featured', async (req, res, next) => {
  try {
    const { rows } = await db.query(`
      SELECT p.id, p.slug, p.name, p.tagline, p.volume, p.price, p.mrp, p.badge, p.img_bg,
             pi.url AS img_src
      FROM products p
      LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_main = true
      WHERE p.is_featured = true AND p.is_active = true
      ORDER BY p.created_at DESC LIMIT 8
    `)
    res.json({ success: true, products: rows.map(formatProduct) })
  } catch (err) { next(err) }
})

// GET /products/bestsellers
router.get('/bestsellers', async (req, res, next) => {
  try {
    const { rows } = await db.query(`
      SELECT p.id, p.slug, p.name, p.tagline, p.volume, p.price, p.mrp, p.badge, p.img_bg,
             pi.url AS img_src
      FROM products p
      LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_main = true
      WHERE p.is_bestseller = true AND p.is_active = true
      ORDER BY p.created_at DESC LIMIT 6
    `)
    res.json({ success: true, products: rows.map(formatProduct) })
  } catch (err) { next(err) }
})

// GET /products/:slug
router.get('/:slug', async (req, res, next) => {
  try {
    const { rows } = await db.query(`
      SELECT p.*, c.name AS category_name, c.slug AS category_slug,
             COALESCE((SELECT quantity FROM inventory WHERE product_id = p.id), 0) AS stock
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = $1 AND p.is_active = true
    `, [req.params.slug])

    if (!rows[0]) throw new AppError('Product not found.', 404, 'NOT_FOUND')
    const p = rows[0]

    const [images, ingredients] = await Promise.all([
      db.query('SELECT url, is_main, alt_text FROM product_images WHERE product_id = $1 ORDER BY sort_order ASC', [p.id]),
      db.query('SELECT name, description, sort_order FROM product_ingredients WHERE product_id = $1 ORDER BY sort_order ASC', [p.id]),
    ])

    res.json({
      success: true,
      product: {
        id: p.id,
        name: p.name,
        slug: p.slug,
        tagline: p.tagline,
        description: p.description,
        volume: p.volume,
        price: parseFloat(p.price).toFixed(2),
        mrp: p.mrp ? parseFloat(p.mrp).toFixed(2) : null,
        badge: p.badge,
        imgBg: p.img_bg,
        notes: { top: p.notes_top, heart: p.notes_heart, base: p.notes_base },
        burn_time: p.burn_time,
        vessel: p.vessel,
        category: { name: p.category_name, slug: p.category_slug },
        images: images.rows.map(r => ({ url: r.url, isMain: r.is_main, altText: r.alt_text })),
        ingredients: ingredients.rows,
        in_stock: parseInt(p.stock) > 0,
      },
    })
  } catch (err) { next(err) }
})

// GET /products/:id/reviews
router.get('/:id/reviews', async (req, res, next) => {
  try {
    const { rows } = await db.query(`
      SELECT r.id, r.rating, r.title, r.body, r.created_at, u.full_name AS user_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = $1 AND r.is_approved = true
      ORDER BY r.created_at DESC
    `, [req.params.id])
    res.json({ success: true, reviews: rows })
  } catch (err) { next(err) }
})

// POST /products/:id/reviews
router.post('/:id/reviews', requireUser, async (req, res, next) => {
  try {
    const { rating, title, body, order_id } = req.body
    if (!rating || rating < 1 || rating > 5) throw new AppError('Rating must be 1-5.', 400, 'VALIDATION_ERROR')
    const id = uuidv4()
    await db.query(
      'INSERT INTO reviews (id, user_id, product_id, order_id, rating, title, body) VALUES ($1,$2,$3,$4,$5,$6,$7)',
      [id, req.user.id, req.params.id, order_id || null, rating, title, body]
    )
    res.status(201).json({ success: true, message: 'Review submitted for approval.' })
  } catch (err) { next(err) }
})

module.exports = router
