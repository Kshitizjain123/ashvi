const router = require('express').Router()
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const { requireAdmin } = require('../../middleware/auth')
const { AppError } = require('../../middleware/errorHandler')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new AppError('Only image files are allowed.', 400, 'VALIDATION_ERROR'))
    }
    cb(null, true)
  },
})

// POST /v1/admin/upload
router.post('/', requireAdmin, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) throw new AppError('No image file provided.', 400, 'VALIDATION_ERROR')

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'ashvi/products', resource_type: 'image' },
        (error, result) => {
          if (error) reject(new AppError(error.message || 'Upload failed.', 500, 'UPLOAD_ERROR'))
          else resolve(result)
        }
      )
      stream.end(req.file.buffer)
    })

    res.json({ success: true, url: result.secure_url })
  } catch (err) {
    next(err)
  }
})

module.exports = router
