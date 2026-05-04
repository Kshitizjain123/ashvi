const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')
const cloudinary = require('cloudinary').v2
const { requireAdmin } = require('../../middleware/auth')
const { AppError } = require('../../middleware/errorHandler')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const cloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'placeholder'

// Local uploads folder is at project root (one level above backend/)
const UPLOADS_DIR = path.join(__dirname, '../../../../uploads')
if (!cloudinaryConfigured && !fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true })
}

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

    if (cloudinaryConfigured) {
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
      return res.json({ success: true, url: result.secure_url })
    }

    // Local fallback — save to uploads/ at project root
    const ext = path.extname(req.file.originalname) || '.jpg'
    const filename = uuidv4() + ext
    const filepath = path.join(UPLOADS_DIR, filename)
    fs.writeFileSync(filepath, req.file.buffer)

    const baseUrl = process.env.BASE_URL ||
      (process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : `http://localhost:${process.env.PORT || 3002}`)
    res.json({ success: true, url: `${baseUrl}/uploads/${filename}` })
  } catch (err) {
    next(err)
  }
})

module.exports = router
