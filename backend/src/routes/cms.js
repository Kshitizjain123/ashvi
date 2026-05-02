const router = require('express').Router()
const db = require('../config/db')

// GET /cms/ticker
router.get('/ticker', async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'SELECT id, message FROM ticker_messages WHERE is_active = true ORDER BY sort_order ASC'
    )
    res.json({ success: true, messages: rows })
  } catch (err) { next(err) }
})

// GET /cms/banners/:placement
router.get('/banners/:placement', async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'SELECT id, img_url, link_url, alt_text, heading, body_text, cta_text FROM banners WHERE placement = $1 AND is_active = true ORDER BY sort_order ASC',
      [req.params.placement]
    )
    res.json({ success: true, banners: rows })
  } catch (err) { next(err) }
})

module.exports = router
