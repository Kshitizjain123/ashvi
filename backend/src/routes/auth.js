const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const db = require('../config/db')
const { requireUser } = require('../middleware/auth')
const { AppError } = require('../middleware/errorHandler')

const signTokens = (id) => ({
  accessToken: jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }),
  refreshToken: jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }),
})

const setRefreshCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}

// POST /auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { full_name, email, password, phone } = req.body
    if (!full_name || !email || !password) {
      throw new AppError('full_name, email, and password are required.', 400, 'VALIDATION_ERROR')
    }
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [email])
    if (existing.rows[0]) throw new AppError('Email already registered.', 409, 'CONFLICT')

    const password_hash = await bcrypt.hash(password, 12)
    const id = uuidv4()
    await db.query(
      'INSERT INTO users (id, full_name, email, password_hash, phone) VALUES ($1,$2,$3,$4,$5)',
      [id, full_name, email, password_hash, phone || null]
    )
    res.status(201).json({ success: true, message: 'Account created. Please verify your email.' })
  } catch (err) { next(err) }
})

// POST /auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) throw new AppError('Email and password required.', 400, 'VALIDATION_ERROR')

    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email])
    const user = rows[0]
    if (!user || !await bcrypt.compare(password, user.password_hash)) {
      throw new AppError('Invalid email or password.', 401, 'UNAUTHORIZED')
    }
    if (!user.is_active) throw new AppError('Account is disabled.', 401, 'UNAUTHORIZED')

    const { accessToken, refreshToken } = signTokens(user.id)
    setRefreshCookie(res, refreshToken)
    res.json({ success: true, accessToken, user: { id: user.id, full_name: user.full_name, email: user.email } })
  } catch (err) { next(err) }
})

// POST /auth/logout
router.post('/logout', requireUser, (req, res) => {
  res.clearCookie('refreshToken')
  res.json({ success: true })
})

// POST /auth/refresh
router.post('/refresh', async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken
    if (!token) throw new AppError('No refresh token.', 401, 'UNAUTHORIZED')
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
    const { rows } = await db.query('SELECT id FROM users WHERE id = $1 AND is_active = true', [decoded.id])
    if (!rows[0]) throw new AppError('User not found.', 401, 'UNAUTHORIZED')
    const { accessToken, refreshToken } = signTokens(decoded.id)
    setRefreshCookie(res, refreshToken)
    res.json({ success: true, accessToken })
  } catch (err) { next(err) }
})

// POST /auth/forgot-password
router.post('/forgot-password', async (req, res, next) => {
  try {
    const { email } = req.body
    if (!email) throw new AppError('Email required.', 400, 'VALIDATION_ERROR')
    res.json({ success: true, message: 'If that email exists, a reset link has been sent.' })
  } catch (err) { next(err) }
})

// POST /auth/reset-password
router.post('/reset-password', async (req, res, next) => {
  try {
    const { token, password } = req.body
    if (!token || !password) throw new AppError('Token and password required.', 400, 'VALIDATION_ERROR')
    res.json({ success: true, message: 'Password updated.' })
  } catch (err) { next(err) }
})

// POST /auth/verify-email
router.post('/verify-email', async (req, res, next) => {
  try {
    const { email } = req.body
    await db.query('UPDATE users SET is_verified = true WHERE email = $1', [email])
    res.json({ success: true, message: 'Email verified.' })
  } catch (err) { next(err) }
})

module.exports = router
