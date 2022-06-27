import { clamp } from 'lodash-es'
import createError from 'http-errors'
import Authors from '../../models/Authors.js'
import toBoolean from '../utils/toBoolean.js'
import parseName from '../utils/parseName.js'
import getPaginationParams from '../utils/getPaginationParams.js'

/**
 * Search Operators
 */
const SearchOperator = {
  // The autocomplete operator
  // This operator can only be used with a search index that is configured for
  // autocomplete search.
  // @see https://docs.atlas.mongodb.com/reference/atlas-search/autocomplete
  autocomplete: 'autocomplete',
  // The `text` operator performs a standard text search and is similar to
  // mongodb's legacy text search feature.
  // @see https://docs.atlas.mongodb.com/reference/atlas-search/text
  text: 'text',
}

/**
 * Search index Names
 * @see https://docs.atlas.mongodb.com/reference/atlas-search/index-definitions/
 */
const SearchIndex = {
  // The default search index
  default: 'default',
  // This search index is configured for autocomplete search and must be used
  // with the `autocomplete` operator.
  autocomplete: 'autocompleteIndex',
}

/**
 * Search for authors by name
 *
 * This feature is intended to power a search bar that can display autocomplete
 * suggestions as the user types. It is powered by Atlas Search, mongodb's new
 * search engine feature.
 *
 *
 * @warn This feature is a work in progress. The API may change at any time.
 * @warn Atlas Search is not supported on local mongodb deployments
 *
 * @param {Object} req
 * @param {Object} req.query
 * @param {string} req.query.query the search query
 * @param {Object} [req.query.autocomplete = true] Enable autocomplete mode.
 * @param {number} [req.query.fuzzy = 0] The number of characters that can
 *     be modified in order to create a match. This allows for minor
 *     misspellings and typos. This param is not currently implemented.
 * @param {number} [req.query.matchThreshold = 2] The minimum number of search
 *     terms that must match for an author to be included in results. If this
 *     is set to 1, results will include all authors that match at least one
 *     term in the query. So query="John F Kennedy" would  return all authors
 *     that match "john" or "kennedy". When this is set to `2`, if the query
 *     contains two or more terms, at least two of those terms must match for
 *     an author to be included in the results. In this case, query="john F
 *     Kennedy", would only return authors that match "John" and "Kennedy". And
 *     query="John Quincy Adams" would return authors that match any two of the
 *     three terms "john", "quincy" and "adams".
 * @param {number} [req.query.limit = 20] Results per page
 * @param {number} [req.query.page = 0] page of results to return
 *
 * @see https://docs.atlas.mongodb.com/reference/atlas-search/
 * @see https://docs.atlas.mongodb.com/reference/atlas-search/text
 * @see https://docs.atlas.mongodb.com/reference/atlas-search/compound/
 * @see https://docs.atlas.mongodb.com/reference/atlas-search/autocomplete
 * @see https://docs.atlas.mongodb.com/reference/atlas-search/index-definitions/
 * @see https://docs.atlas.mongodb.com/reference/atlas-search/scoring
 */
export default async function searchAuthors(req, res, next) {
  try {
    const { query, autocomplete = true, matchThreshold = 2 } = req.query
    const { skip: $skip, limit: $limit, page } = getPaginationParams(req.query)

    // Parse the query into terms.
    // =======================================================================
    // "Terms" include all words except for: initials, prefixes, suffixes, and
    // stopwords.
    // -----------------------------------------------------
    //
    //   term      term
    //     |         |
    //   John  F.  Kennedy  Jr.
    //         |             |
    //      initial        suffix
    // -----------------------------------------------------
    //             term       term
    //              |          |
    //    Saint Augustine of Hippo
    //     |              |
    //   prefix         stopword
    //
    // -----------------------------------------------------
    const { terms, value } = parseName(query)

    if (!query) {
      // Respond with error if query param is empty
      return next(createError(422, 'Missing required parameter: `query`'))
    }

    const $project = { __v: 0, aka: 0 }

    // Let `indexName` be the name of the search index to use. This name
    // corresponds to a search index configured via the Atlas dashboard.
    const indexName = toBoolean(autocomplete)
      ? SearchIndex.autocomplete
      : SearchIndex.default

    // Let `operator` be the name of the search operator to use
    const operator = toBoolean(autocomplete)
      ? SearchOperator.autocomplete
      : SearchOperator.text

    // Let `$search` be the search query
    // NOTE: The `compound` operator
    const $search = {
      index: indexName,
      compound: {},
    }

    if (terms.length) {
      // Required clause
      // This clause determines which authors will be included in the results.
      // TODO: explain
      $search.compound.must = {
        compound: {
          minimumShouldMatch: Math.min(terms.length, matchThreshold),
          should: terms.map(term => ({
            [operator]: { query: term, path: 'name' },
          })),
        },
      }
    }

    // This clause checks author `names` against the entire search string to
    // improve sorting accuracy. This
    // 1) allows things like initials, prefixes and suffixes, which are
    //    not considered "terms", to be taken into account when sorting
    //    results.
    // 2) ensures that results are in the correct order when multiple authors
    //    match all of the "terms" in the query. For example:
    //    query="John Adams" =>
    //    | 1. "John Adams" (should be first because it matches exactly)
    //    | 2. "John Quincy Adams"
    $search.compound.should = [{ [operator]: { query: value, path: 'name' } }]

    const [results, [meta]] = await Promise.all([
      // Get paginated search results
      Authors.aggregate([{ $search }, { $skip }, { $limit }, { $project }]),
      // Get the total number of results that match the search
      Authors.aggregate([{ $search }, { $count: 'totalCount' }]),
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
