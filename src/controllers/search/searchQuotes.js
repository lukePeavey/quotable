const clamp = require('lodash/clamp')
const omit = require('lodash/omit')
const createError = require('http-errors')
const Quotes = require('../../models/Quotes')

/**
 * Search for quotes by content and author
 *
 * @param {Object} params
 * @param {Object} params.query The search query
 * @param {number} [params.limit = 20] The maximum number of results to include
 *     in a single response.
 * @param {number} [params.skip = 0] The offset for pagination.
 */
module.exports = async function searchQuotes(req, res, next) {
  try {
    const { query = '' } = req.query
    let { limit = 20, skip = 0 } = req.query

    // Use a $text search query to search `content` and `author` fields
    // @see https://docs.mongodb.com/manual/reference/operator/query/text
    const filter = {
      $text: { $search: query },
    }

    // Add a `score` field that will be used to sort results by text score.
    // @see https://docs.mongodb.com/manual/reference/operator/projection/meta
    const projection = {
      score: { $meta: 'textScore' },
    }

    // Sorting and pagination params
    limit = clamp(parseInt(limit), 0, 50) || 20
    skip = parseInt(skip) || 0

    const [results, totalCount] = await Promise.all([
      Quotes.find(filter, projection)
        .sort({ score: { $meta: 'textScore' } })
        .skip(skip)
        .limit(limit)
        .select('-__v -authorId'),

      Quotes.countDocuments(filter),
    ])

    // `lastItemIndex` is the offset of the last result returned by this
    // request. When paginating through results, this would be used as the
    // `skip` parameter when requesting the next page of results. It will be
    // set to `null` if there are no additional results.
    const lastItemIndex = skip + results.length

    // Return a paginated list of quotes to client
    res.status(200).json({
      count: results.length,
      totalCount,
      lastItemIndex: lastItemIndex >= totalCount ? null : lastItemIndex,
      results: results.map(doc => omit(doc.toJSON(), 'score')),
    })
  } catch (error) {
    return next(error)
  }
}
