const createError = require('http-errors')
const Quotes = require('../../models/Quotes')
const getTagsFilter = require('../utils/getTagsFilter')
const getLengthFilter = require('../utils/getLengthFilter')

/**
 * Get a single random quote
 */
module.exports = async function getRandomQuote(req, res, next) {
  try {
    // save our query parameters
    const { minLength, maxLength, tags } = req.query

    const filter = {}

    if (minLength || maxLength) {
      filter.length = getLengthFilter(minLength, maxLength)
    }

    if (tags) {
      filter.tags = getTagsFilter(tags)
    }

    const [result] = await Quotes.aggregate([
      // Apply filters (if any)
      { $match: filter },
      // Select a random document from the results
      { $sample: { size: 1 } },
      { $project: { __v: 0, authorId: 0 } },
    ])

    if (!result) {
      // This should only occur when using filter params
      return next(createError(404, 'Could not find any matching quotes'))
    }
    res.status(200).json(result)
  } catch (error) {
    return next(error)
  }
}
