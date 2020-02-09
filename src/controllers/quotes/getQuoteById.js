const createError = require('http-errors')
const Quotes = require('../../models/Quotes')

/**
 * Get a single quote by its ID
 */
module.exports = async function getQuoteById(req, res, next) {
  try {
    const { id } = req.params
    const quote = await Quotes.findById(id).select('content author tags')

    if (!quote) {
      return next(createError(404, 'The requested resource could not be found'))
    }

    res.status(200).json({
      _id: quote._id,
      content: quote.content,
      author: quote.author,
    })
  } catch (error) {
    return next(error)
  }
}
