const lowerCase = require('lodash/lowerCase')
const clamp = require('lodash/clamp')
const createError = require('http-errors')
const Quote = require('../../models/Quotes')

/**
 * Search quotes by keyword, phrase, or author.
 *
 * @param {Object} req
 * @param {Object} req.query
 * @param {string} query The search query. The query can be wrapped in
 *     quotes to search for an exact phrase.
 * @param {string} fields Specify which fields to search
 *     by. It takes a comma separated list of field names
 * @param {string} [slop = 0] When searching for an exact phrase,
 *     this controls how much flexibility is allowed in the order of the search
 *     terms. See mongodb docs.
 */
module.exports = async function searchQuotes(req, res, next) {
  try {
    let { query, fields = 'content, author', limit, skip, slop } = req.query
    // Parse params
    query = lowerCase(query)
    fields = fields.split(',').map(field => field.trim())

    // Pagination params
    limit = clamp(limit, 0, 50) || 20
    skip = clamp(skip, 0, 1e3) || 0
    slop = clamp(slop, 0, 1e3) || 0

    const supportedFields = ['author', 'content', 'tags']
    const isExactPhrase = /^(".+")|('.+')$/.test(query)

    if (!query) {
      // Respond with error if `query` param is empty
      return next(createError(422, 'Missing required parameter: `query`'))
    }

    if (fields.some(field => !supportedFields.includes(field))) {
      // Respond with error if `fields` param is invalid
      return next(createError(422, 'Invalid parameter: `fields`'))
    }

    // The search query
    // @see https://docs.atlas.mongodb.com/atlas-search/
    let $search

    if (isExactPhrase) {
      // Search for an exact phrase...
      // @see https://docs.atlas.mongodb.com/reference/atlas-search/phrase/
      $search = {
        phrase: { query, path: fields, slop },
      }
    } else {
      // Otherwise, use text search...
      // @see https://docs.atlas.mongodb.com/reference/atlas-search/text/
      $search = {
        text: { query, path: fields },
      }
    }

    // Query database
    const [results, [meta]] = await Promise.all([
      // Get paginated search results
      Quote.aggregate([{ $search }, { $skip: skip }, { $limit: limit }]),
      // Get the total number of results that match the search
      Quote.aggregate([{ $search }, { $count: 'totalCount' }]),
    ])

    // Pagination info
    const { totalCount = 0 } = meta || {}
    const count = results.length
    const lastItemIndex = skip + count < totalCount ? skip + count : null
    // Send response
    res.json({ count, totalCount, lastItemIndex, results })
  } catch (error) {
    return next(error)
  }
}
