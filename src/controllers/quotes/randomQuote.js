const random = require('lodash/random')
const createError = require('http-errors')
const Quotes = require('../../models/Quotes')

/**
 * Get a single random quote
 */
module.exports = async function getRandomQuote(req, res, next) {
  try {
    const documentCount = await Quotes.estimatedDocumentCount()
    const index = random(0, documentCount - 1)
    const entry = await Quotes.find({})
      .limit(1)
      .skip(index)
      .select('content author')
    if (!entry || !entry[0]) {
      return next(createError(500, `Invalid random index: \`${index}\``))
    }
    res.status(200).json(entry[0])
  } catch (error) {
    return next(error)
  }
}
