import createError from 'http-errors'
import { clamp } from 'lodash-es'
import Quotes from '../../models/Quotes.js'
import getTagsFilter from '../utils/getTagsFilter.js'
import getLengthFilter from '../utils/getLengthFilter.js'
import slug from '../utils/slug.js'
import { MAX_RANDOM_COUNT } from '../../constants.js'

/**
 * Get one or more random quotes.
 *
 * This is a non-paginated endpoint that can return multiple objects.
 * Unlike paginated endpoints, the response does not include pagination
 * properties such as `count`, `totalCount`, `page`, etc. The response
 * is simply an Array containing one or more quote objects.
 *
 * The `limit` parameter specifies the maximum number of random quotes
 * to return. If filter parameters are also used, the number of quotes
 * returned may be less than the limit parameter, or even zero if no
 * quotes match the parameters.
 *
 * @param {Object} params
 * @param {string} [params.tags] List of tags separated by comma or pipe
 * @param {string} [params.authorSlug] One or more author slugs (pipe separated)
 * @param {string} [params.minLength] minimum quote length in characters
 * @param {string} [params.maxLength] maximum quote length in characters
 */
export default async function getRandomQuote(req, res, next) {
  try {
    const {
      minLength,
      maxLength,
      tags,
      author,
      authorId,
      authorSlug,
      limit = 1,
    } = req.query

    // Let `size` be the number of random quotes to retrieve
    // Note: if
    const size = clamp(parseInt(limit), 1, MAX_RANDOM_COUNT)

    const filter = {}

    if (minLength || maxLength) {
      filter.length = getLengthFilter(minLength, maxLength)
    }

    if (tags) {
      filter.tags = getTagsFilter(tags)
    }

    if (authorId) {
      // @deprecated
      // Use the `author` param to filter by author `name` or `slug` instead
      filter.authorId = { $in: authorId.split('|') }
    }

    if (author) {
      if (/,/.test(author)) {
        // If `author` is a comma-separated list, respond with an error
        const message = 'Multiple authors should be separated by a pipe.'
        return next(createError(400, message))
      }
      // Filter quotes by author slug.
      filter.authorSlug = { $in: author.split('|').map(slug) }
    }

    if (authorSlug) {
      // @deprecated
      // use `author` param instead
      filter.authorSlug = { $in: author.split('|').map(slug) }
    }

    const results = await Quotes.aggregate([
      // Apply filters (if any)
      { $match: filter },
      // Select n random quotes from the database, where n = limit
      { $sample: { size: limit } },
      { $project: { __v: 0, authorId: 0 } },
    ])
    const count = results.length
    // Return the array of random quotes
    // If there are no quotes that match the given query parameters (filters),
    // the method will response with an empty array
    res.status(200).json(results)
  } catch (error) {
    return next(error)
  }
}
