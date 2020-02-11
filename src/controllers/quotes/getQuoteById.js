const createError = require('http-errors')
const Quotes = require('../../models/Quotes')

/**
 * Get a single quote by its ID
 */
module.exports = async function getQuoteById(req, res, next) {
  try {
    const { id } = req.params
    const result = await Quotes.findById(id).select('-__v -authorId')

    if (!result) {
      return next(createError(404, 'The requested resource could not be found'))
    }

    res.status(200).json(result)
  } catch (error) {
    return next(error)
  }
}
