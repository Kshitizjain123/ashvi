const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../../config/db')
const { AppError } = require('../../middleware/errorHandler')

// POST /admin/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) throw new AppError('Email and password required.', 400, 'VALIDATION_ERROR')

    const { rows } = await db.query('SELECT * FROM admins WHERE email = $1', [email])
    const admin = rows[0]
    if (!admin || !await bcrypt.compare(password, admin.password_hash)) {
      throw new AppError('Invalid email or password.', 401, 'UNAUTHORIZED')
    }
    if (!admin.is_active) throw new AppError('Account is disabled.', 401, 'UNAUTHORIZED')

    const accessToken = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: '8h' })
    res.json({ success: true, accessToken, admin: { id: admin.id, full_name: admin.full_name, email: admin.email, role: admin.role } })
  } catch (err) { next(err) }
})

module.exports = router
