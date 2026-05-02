const jwt = require('jsonwebtoken')
const db = require('../config/db')

const unauthorized = (res) => res.status(401).json({
  success: false,
  error: { code: 'UNAUTHORIZED', message: 'Authentication required.', statusCode: 401 }
})

const forbidden = (res) => res.status(403).json({
  success: false,
  error: { code: 'FORBIDDEN', message: 'Insufficient permissions.', statusCode: 403 }
})

const requireUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return unauthorized(res)
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const { rows } = await db.query('SELECT id, email, is_active FROM users WHERE id = $1', [decoded.id])
    if (!rows[0] || !rows[0].is_active) return unauthorized(res)
    req.user = { ...rows[0], type: 'user' }
    next()
  } catch {
    unauthorized(res)
  }
}

const requireAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return unauthorized(res)
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const { rows } = await db.query('SELECT id, email, role, is_active FROM admins WHERE id = $1', [decoded.id])
    if (!rows[0] || !rows[0].is_active) return unauthorized(res)
    req.admin = { ...rows[0], type: 'admin' }
    next()
  } catch {
    unauthorized(res)
  }
}

const requireRole = (...roles) => (req, res, next) => {
  if (!req.admin) return unauthorized(res)
  if (!roles.includes(req.admin.role)) return forbidden(res)
  next()
}

module.exports = { requireUser, requireAdmin, requireRole }
