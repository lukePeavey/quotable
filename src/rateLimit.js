import rateLimit from 'express-rate-limit'

const LIMIT = process.env.RATE_LIMIT || 180
const MINUTE = 60 * 1000
const HOUR = 60 * 60 * 1000

// Rate limit settings
// Sets a rate limit of 150 requests per minute (by IP address)
export default rateLimit({
  // The maximum number of requests that can be made within the specified time window
  max: LIMIT,
  // The time window for the the rate limit
  windowMs: MINUTE,
  // Return rate limit info in the `RateLimit-*` headers
  standardHeaders: true,
  // Disable the `X-RateLimit-*` headers
  legacyHeaders: false,
  // Handle response when rate limit has been exceeded
  handler: (_, response) => {
    const statusCode = 429
    const statusMessage = 'Too Many Requests'
    response.status(statusCode).json({ statusCode, statusMessage })
  },
})
