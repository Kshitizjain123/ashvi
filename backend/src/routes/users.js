const router = require('express').Router()
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')
const db = require('../config/db')
const { requireUser } = require('../middleware/auth')
const { AppError } = require('../middleware/errorHandler')

// GET /users/me
router.get('/me', requireUser, async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'SELECT id, full_name, email, phone, is_verified, created_at FROM users WHERE id = $1',
      [req.user.id]
    )
    res.json({ success: true, user: rows[0] })
  } catch (err) { next(err) }
})

// PATCH /users/me
router.patch('/me', requireUser, async (req, res, next) => {
  try {
    const { full_name, phone } = req.body
    await db.query(
      'UPDATE users SET full_name = COALESCE($1, full_name), phone = COALESCE($2, phone), updated_at = NOW() WHERE id = $3',
      [full_name, phone, req.user.id]
    )
    res.json({ success: true })
  } catch (err) { next(err) }
})

// PATCH /users/me/password
router.patch('/me/password', requireUser, async (req, res, next) => {
  try {
    const { current_password, new_password } = req.body
    if (!current_password || !new_password) throw new AppError('Both passwords required.', 400, 'VALIDATION_ERROR')
    const { rows } = await db.query('SELECT password_hash FROM users WHERE id = $1', [req.user.id])
    if (!await bcrypt.compare(current_password, rows[0].password_hash)) {
      throw new AppError('Current password incorrect.', 401, 'UNAUTHORIZED')
    }
    const hash = await bcrypt.hash(new_password, 12)
    await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hash, req.user.id])
    res.json({ success: true })
  } catch (err) { next(err) }
})

// GET /users/me/addresses
router.get('/me/addresses', requireUser, async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC', [req.user.id])
    res.json({ success: true, addresses: rows })
  } catch (err) { next(err) }
})

// POST /users/me/addresses
router.post('/me/addresses', requireUser, async (req, res, next) => {
  try {
    const { label, line1, line2, city, state, postal_code, country, is_default } = req.body
    if (!line1 || !city || !state || !postal_code) throw new AppError('Address fields required.', 400, 'VALIDATION_ERROR')
    const id = uuidv4()
    if (is_default) {
      await db.query('UPDATE addresses SET is_default = false WHERE user_id = $1', [req.user.id])
    }
    await db.query(
      'INSERT INTO addresses (id, user_id, label, line1, line2, city, state, postal_code, country, is_default) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
      [id, req.user.id, label, line1, line2, city, state, postal_code, country || 'India', is_default || false]
    )
    res.status(201).json({ success: true, id })
  } catch (err) { next(err) }
})

// PATCH /users/me/addresses/:id
router.patch('/me/addresses/:id', requireUser, async (req, res, next) => {
  try {
    const { label, line1, line2, city, state, postal_code, country, is_default } = req.body
    if (is_default) {
      await db.query('UPDATE addresses SET is_default = false WHERE user_id = $1', [req.user.id])
    }
    await db.query(
      `UPDATE addresses SET
        label = COALESCE($1, label), line1 = COALESCE($2, line1), line2 = COALESCE($3, line2),
        city = COALESCE($4, city), state = COALESCE($5, state), postal_code = COALESCE($6, postal_code),
        country = COALESCE($7, country), is_default = COALESCE($8, is_default)
       WHERE id = $9 AND user_id = $10`,
      [label, line1, line2, city, state, postal_code, country, is_default, req.params.id, req.user.id]
    )
    res.json({ success: true })
  } catch (err) { next(err) }
})

// DELETE /users/me/addresses/:id
router.delete('/me/addresses/:id', requireUser, async (req, res, next) => {
  try {
    await db.query('DELETE FROM addresses WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id])
    res.json({ success: true })
  } catch (err) { next(err) }
})

// GET /users/me/notifications
router.get('/me/notifications', requireUser, async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
      [req.user.id]
    )
    res.json({ success: true, notifications: rows })
  } catch (err) { next(err) }
})

// PATCH /users/me/notifications/:id/read
router.patch('/me/notifications/:id/read', requireUser, async (req, res, next) => {
  try {
    await db.query('UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id])
    res.json({ success: true })
  } catch (err) { next(err) }
})

module.exports = router
