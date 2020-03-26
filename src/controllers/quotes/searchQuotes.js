const clamp = require('lodash/clamp')
const escapeRegExp = require('lodash/escapeRegExp')
const Quotes = require('../../models/Quotes')

/**
 * Search multiple quotes by keyword.
 *
 * @param {Object} params
 * @param {number} [params.limit = 20] The maximum number of results to include
 *     in a single response.
 * @param {number} [params.skip = 0] The offset for pagination.
 */
module.exports = async function searchQuotes(req, res, next) {
  try {
    const { keywords } = req.params
    let { limit, skip = 0 } = req.query

    // Query filters
    const filter = {}
    filter.content = new RegExp(escapeRegExp(keywords), 'gi')

    // Sorting and pagination params
    // TODO: Add sorting options for this method
    const sortBy = '_id'
    const sortOrder = 1
    limit = clamp(parseInt(limit), 0, 50) || 20
    skip = parseInt(skip) || 0

    // Fetch paginated results
    const [results, totalCount] = await Promise.all([
      Quotes.find(filter)
        .sort({ [sortBy]: sortOrder })
        .limit(limit)
        .skip(skip)
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
      results,
    })
  } catch (error) {
    return next(error)
  }
}
