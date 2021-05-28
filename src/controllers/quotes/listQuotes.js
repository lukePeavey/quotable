import clamp from 'lodash/clamp'
import createError from 'http-errors'
import Quotes from '../../models/Quotes'
import getTagsFilter from '../utils/getTagsFilter'
import getLengthFilter from '../utils/getLengthFilter'
import slug from '../utils/slug'

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
export default async function listQuotes(req, res, next) {
  try {
    const { author, authorId, tags, minLength, maxLength } = req.query
    let { limit, skip = 0, page } = req.query

    // Query filters
    const filter = {}

    if (author) {
      // Filter by author `name` or `slug`
      if (/,/.test(author)) {
        // If `author` is a comma-separated list, respond with error.
        const message = 'Multiple authors should be separated by a pipe.'
        return next(createError(400, message))
      }
      filter.authorSlug = author.split('|').map(slug)
    } else if (authorId) {
      // @deprecated
      // Use author `slug` instead of _id.
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
    limit = clamp(parseInt(limit), 0, 150) || 20
    skip = parseInt(skip) || (parseInt(page) - 1) * limit || 0

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

    // 'page' is the page number that the first result of the request
    // When Paginating through results, this would be used as the
    // 'page' parameter when requesting the next page of results.
    page = Math.ceil(lastItemIndex / limit)

    // 'totalPages' is total number of pages based on results per page
    const totalPages = Math.ceil(totalCount / limit)

    // Return a paginated list of quotes to client
    res.status(200).json({
      count: results.length,
      totalCount,
      totalPages,
      page,
      lastItemIndex: lastItemIndex >= totalCount ? null : lastItemIndex,
      results,
    })
  } catch (error) {
    return next(error)
  }
}
