const clamp = require('lodash/clamp')
const escapeRegExp = require('lodash/escapeRegExp')
const Quotes = require('../../models/Quotes')
const getTagsFilter = require('../utils/getTagsFilter')
const getLengthFilter = require('../utils/getLengthFilter')

/**
 * Get multiple quotes from the database.
 *
 * @param {Object} params
 * @param {string} [params.authorId] Filter results by authorId
 * @param {string} [params.tags] List of tags separated by comma or pipe
 * @param {number} [params.limit = 20] The maximum number of results to include
 *     in a single response.
 * @param {number} [params.skip = 0] The offset for pagination.
 */
module.exports = async function listQuotes(req, res, next) {
  try {
    const { author, authorId, tags, minLength, maxLength } = req.query
    let { limit, skip = 0 } = req.query

    // Query filters
    const filter = {}

    if (author) {
      // Search for quotes by author name (supports "fuzzy" search)
      // TODO: Move this feature to a separate search endpoint
      filter.author = new RegExp(escapeRegExp(author), 'gi')
    } else if (authorId) {
      // Get quotes by author ID
      filter.authorId = authorId
    }

    if (minLength || maxLength) {
      filter.length = getLengthFilter(minLength, maxLength)
    }

    if (tags) {
      filter.tags = getTagsFilter(tags)
    }

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
