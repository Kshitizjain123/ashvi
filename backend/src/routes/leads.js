const router = require('express').Router()
const db = require('../config/db')
const { AppError } = require('../middleware/errorHandler')

// POST /leads/checkout
router.post('/checkout', async (req, res, next) => {
  try {
    const { name, mobile, address, items = [], subtotal = 0, shipping = 0, total = 0, message = '' } = req.body
    const fullName = String(name || '').trim()
    const phone = String(mobile || '').trim()
    const deliveryAddress = String(address || '').trim()

    if (!fullName || !phone || !deliveryAddress) {
      throw new AppError('Name, mobile number, and address are required.', 400, 'VALIDATION_ERROR')
    }
    if (!Array.isArray(items) || items.length === 0) {
      throw new AppError('At least one cart item is required.', 400, 'VALIDATION_ERROR')
    }

    const cleanItems = items.map(item => ({
      product_id: item.product_id || null,
      product_name: String(item.product_name || item.name || '').trim(),
      quantity: Number(item.quantity || item.qty || 1),
      unit_price: Number(item.unit_price || item.price || 0),
      total_price: Number(item.total_price || 0),
    })).filter(item => item.product_name && item.quantity > 0)

    if (cleanItems.length === 0) {
      throw new AppError('Valid cart items are required.', 400, 'VALIDATION_ERROR')
    }

    const { rows } = await db.query(`
      INSERT INTO checkout_leads (
        full_name, phone, address, status, items, subtotal, shipping_amount, total_amount, whatsapp_message, updated_at
      ) VALUES ($1,$2,$3,'order_initiated',$4::jsonb,$5,$6,$7,$8,NOW())
      ON CONFLICT (phone) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        address = EXCLUDED.address,
        status = 'order_initiated',
        items = EXCLUDED.items,
        subtotal = EXCLUDED.subtotal,
        shipping_amount = EXCLUDED.shipping_amount,
        total_amount = EXCLUDED.total_amount,
        whatsapp_message = EXCLUDED.whatsapp_message,
        updated_at = NOW()
      RETURNING id
    `, [
      fullName,
      phone,
      deliveryAddress,
      JSON.stringify(cleanItems),
      Number(subtotal) || 0,
      Number(shipping) || 0,
      Number(total) || 0,
      String(message || '').slice(0, 5000),
    ])

    res.status(201).json({ success: true, leadId: rows[0].id })
  } catch (err) { next(err) }
})

module.exports = router
