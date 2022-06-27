import { lowerCase, clamp } from 'lodash-es'
import createError from 'http-errors'
import Quote from '../../models/Quotes.js'
import getPaginationParams from '../utils/getPaginationParams.js'

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
 * @param {number} [req.query.limit = 20] Results per page
 * @param {number} [req.query.page = 0] page of results to return
 */
export default async function searchQuotes(req, res, next) {
  try {
    let { query, fields = 'content, author', slop } = req.query
    const { skip: $skip, limit: $limit, page } = getPaginationParams(req.query)
    // Parse params
    query = lowerCase(query)
    fields = fields.split(',').map(field => field.trim())
    slop = clamp(slop, 0, 1e3) || 0

    const supportedFields = ['author', 'content', 'tags']
    const isExactPhrase = /^(".+")|('.+')$/.test(req.query.query)

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
      Quote.aggregate([{ $search }, { $skip }, { $limit }]),
      // Get the total number of results that match the search
      Quote.aggregate([{ $search }, { $count: 'totalCount' }]),
    ])

    // Pagination info
    const { totalCount = 0 } = meta || {}
    const count = results.length
    // The (1-based) index of the last result returned by this request
    const lastItemIndex = $skip + count < totalCount ? $skip + count : null
    // 'totalPages' is total number of pages based on results per page
    const totalPages = Math.ceil(totalCount / $limit)
    // Send response
    res.json({ count, totalCount, page, totalPages, lastItemIndex, results })
  } catch (error) {
    return next(error)
  }
}
