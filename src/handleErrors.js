const createError = require('http-errors')
/** Handles 404 errors */
module.exports.handle404 = function handle404(req, res, next) {
  return next(createError(404, 'The requested resource could not be found'))
}

/** Logs errors in development mode */
module.exports.logErrors = function logErrors(error, req, res, next) {
  if (process.env.NODE_ENV === 'development') {
    /* eslint-disable-next-line no-console */
    console.error(error.stack)
  }
  return next(error)
}

/** Sends error response to client */
module.exports.handleErrors = function handleErrors(error, req, res, next) {
  const statusCode = error.status || 500
  const statusMessage = error.message || 'Internal server error'
  res.status(statusCode).json({ statusCode, statusMessage })
}
