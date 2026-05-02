const errorHandler = (err, req, res, next) => {
  console.error(err)
  const statusCode = err.statusCode || 500
  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected error occurred.',
      statusCode,
    },
  })
}

class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message)
    this.statusCode = statusCode
    this.code = code
  }
}

module.exports = { errorHandler, AppError }
