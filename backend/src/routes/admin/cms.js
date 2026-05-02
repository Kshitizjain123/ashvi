const router = require('express').Router()
const { v4: uuidv4 } = require('uuid')
const db = require('../../config/db')
const { requireAdmin } = require('../../middleware/auth')
const { AppError } = require('../../middleware/errorHandler')

router.use(requireAdmin)

// ── Ticker ──────────────────────────────────────────

// GET /admin/cms/ticker
router.get('/ticker', async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM ticker_messages ORDER BY sort_order ASC')
    res.json({ success: true, messages: rows })
  } catch (err) { next(err) }
})

// POST /admin/cms/ticker
router.post('/ticker', async (req, res, next) => {
  try {
    const { message, sort_order } = req.body
    if (!message) throw new AppError('message required.', 400, 'VALIDATION_ERROR')
    const id = uuidv4()
    await db.query(
      'INSERT INTO ticker_messages (id, message, sort_order, created_by) VALUES ($1,$2,$3,$4)',
      [id, message, sort_order || 0, req.admin.id]
    )
    res.status(201).json({ success: true, id })
  } catch (err) { next(err) }
})

// PATCH /admin/cms/ticker/:id
router.patch('/ticker/:id', async (req, res, next) => {
  try {
    const { message, sort_order, is_active } = req.body
    await db.query(
      `UPDATE ticker_messages SET
        message = COALESCE($1, message),
        sort_order = COALESCE($2, sort_order),
        is_active = COALESCE($3, is_active)
       WHERE id = $4`,
      [message, sort_order, is_active, req.params.id]
    )
    res.json({ success: true })
  } catch (err) { next(err) }
})

// DELETE /admin/cms/ticker/:id
router.delete('/ticker/:id', async (req, res, next) => {
  try {
    await db.query('DELETE FROM ticker_messages WHERE id = $1', [req.params.id])
    res.json({ success: true })
  } catch (err) { next(err) }
})

// ── Banners ──────────────────────────────────────────

// GET /admin/cms/banners
router.get('/banners', async (req, res, next) => {
  try {
    const { placement } = req.query
    const { rows } = placement
      ? await db.query('SELECT * FROM banners WHERE placement = $1 ORDER BY sort_order ASC', [placement])
      : await db.query('SELECT * FROM banners ORDER BY placement ASC, sort_order ASC')
    res.json({ success: true, banners: rows })
  } catch (err) { next(err) }
})

// POST /admin/cms/banners
router.post('/banners', async (req, res, next) => {
  try {
    const { placement, img_url, link_url, alt_text, heading, body_text, cta_text, sort_order } = req.body
    if (!placement || !img_url) throw new AppError('placement and img_url required.', 400, 'VALIDATION_ERROR')
    const id = uuidv4()
    await db.query(
      'INSERT INTO banners (id, placement, img_url, link_url, alt_text, heading, body_text, cta_text, sort_order, created_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
      [id, placement, img_url, link_url, alt_text, heading, body_text, cta_text, sort_order || 0, req.admin.id]
    )
    res.status(201).json({ success: true, id })
  } catch (err) { next(err) }
})

// PATCH /admin/cms/banners/:id
router.patch('/banners/:id', async (req, res, next) => {
  try {
    const { img_url, link_url, alt_text, heading, body_text, cta_text, sort_order, is_active } = req.body
    await db.query(
      `UPDATE banners SET
        img_url = COALESCE($1, img_url), link_url = COALESCE($2, link_url),
        alt_text = COALESCE($3, alt_text), heading = COALESCE($4, heading),
        body_text = COALESCE($5, body_text), cta_text = COALESCE($6, cta_text),
        sort_order = COALESCE($7, sort_order), is_active = COALESCE($8, is_active)
       WHERE id = $9`,
      [img_url, link_url, alt_text, heading, body_text, cta_text, sort_order, is_active, req.params.id]
    )
    res.json({ success: true })
  } catch (err) { next(err) }
})

// DELETE /admin/cms/banners/:id
router.delete('/banners/:id', async (req, res, next) => {
  try {
    await db.query('DELETE FROM banners WHERE id = $1', [req.params.id])
    res.json({ success: true })
  } catch (err) { next(err) }
})

module.exports = router
