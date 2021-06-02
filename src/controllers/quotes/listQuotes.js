import createError from 'http-errors'
import Quotes from '../../models/Quotes'
import getTagsFilter from '../utils/getTagsFilter'
import getLengthFilter from '../utils/getLengthFilter'
import getPaginationParams from '../utils/getPaginationParams'
import slug from '../utils/slug'

/**
 * Get multiple quotes from the database.
 *
 * @param {Object} params
 * @param {string} [params.authorId] Filter results by authorId
 * @param {string} [params.tags] List of tags separated by comma or pipe
 * @param {number} [req.query.limit = 20] Results per page
 * @param {number} [req.query.page = 0] page of results to return
 */
export default async function listQuotes(req, res, next) {
  try {
    const { author, authorId, tags, minLength, maxLength } = req.query
    const { limit, skip, page } = getPaginationParams(req.query)

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

    // Fetch paginated results
    const [results, totalCount] = await Promise.all([
      Quotes.find(filter)
        .sort({ [sortBy]: sortOrder })
        .limit(limit)
        .skip(skip)
        .select('-__v -authorId'),

      Quotes.countDocuments(filter),
    ])

    // The (1-based) index of the last result returned by this request
    const lastItemIndex = skip + results.length

    // 'totalPages' is total number of pages based on results per page
    const totalPages = Math.ceil(totalCount / limit)

    // Return a paginated list of quotes to client
    res.status(200).json({
      count: results.length,
      totalCount,
      page,
      totalPages,
      lastItemIndex: lastItemIndex >= totalCount ? null : lastItemIndex,
      results,
    })
  } catch (error) {
    return next(error)
  }
}
