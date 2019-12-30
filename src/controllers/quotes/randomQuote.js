const createError = require('http-errors')
const Quotes = require('../../models/Quotes')

/**
 * Get a single random quote
 */
module.exports = async function getRandomQuote(req, res, next) {
  try {
    // Use $sample to select a random document from Quotes
    const results = await Quotes.aggregate([{ $sample: { size: 1 } }])

    res.status(200).json({
      _id: results[0]._id,
      content: results[0].content,
      author: results[0].author,
    })
  } catch (error) {
    return next(error)
  }
}
