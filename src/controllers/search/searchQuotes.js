import createError from 'http-errors'
import Quote from '../../models/Quotes.js'
import getPaginationParams from '../utils/getPaginationParams.js'
import { parseQuery } from '../quotes/randomQuotes.js'

/**
 * Search quotes by keyword, phrase, or author.
 *
 * @param {Object} req
 * @param {Object} req.query
 * @param {string} query The search query. The query can be wrapped in
 *     quotes to search for an exact phrase.
 * @param {string} exactPhrase Specify which fields to search
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
    const { slop, debug, query: rawQuery = '' } = req.query

    const defaultPath = ['content', 'tags']
    const { query, exactPhrase } = parseQuery(rawQuery, defaultPath)
    const { skip: $skip, limit: $limit, page } = getPaginationParams(req.query)

    if (!query) {
      // Respond with error if `query` param is empty
      return next(createError(422, 'Missing required parameter: `query`'))
    }

    // The search query
    // @see https://docs.atlas.mongodb.com/atlas-search/
    let $search

    if (exactPhrase) {
      // Search for an exact phrase...
      // @see https://docs.atlas.mongodb.com/reference/atlas-search/phrase/
      $search = {
        phrase: { query, path: 'content', slop: 2 },
      }
    } else {
      // Otherwise, use the `queryString` operator
      // @see https://www.mongodb.com/docs/atlas/atlas-search/queryString/
      $search = {
        queryString: { query, defaultPath: 'content' },
      }
    }

    const [results, [meta]] = await Promise.all([
      // Get paginated search results
      Quote.aggregate([{ $search }, { $skip }, { $limit }]),
      // Get the total number of results that match the search
      Quote.aggregate([{ $search }, { $count: 'totalCount' }]),
    ])
    // Pagination info
    const { totalCount = 0 } = meta || {}
    const count = results.length
    const totalPages = Math.ceil(totalCount / $limit)
    res.json({
      count,
      totalCount,
      page,
      totalPages,
      results,
    })
  } catch (error) {
    return next(error)
  }
}
