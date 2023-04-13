import createError from 'http-errors'
import { lowerCase, toLower, clamp, compact, isEmpty } from 'lodash-es'
import Quotes from '../../models/Quotes.js'
import getTagsFilter from '../utils/getTagsFilter.js'
import getLengthFilter from '../utils/getLengthFilter.js'
import slug from '../utils/slug.js'
import { MAX_RANDOM_COUNT } from '../../constants.js'

/**
 * Returns an object containing the `query` parameter (if any) and a flag that
 * indicates if the query is an advanced query.
 *
 * An advanced query includes
 * - Logical operators (AND | OR | NOT)
 * - Prefixed search terms `<field>:<search term>`
 *
 * @param {string} rawQuery the `query` parameter
 * @return {{query: string, isAdvancedQuery: boolean}}
 */
export function parseQuery(rawQuery, defaultFields) {
  // Exact phrase...
  // If the query is wrapped in quotes, we search for an exact phrase.
  // https://www.mongodb.com/docs/atlas/atlas-search/phrase/
  if (/^(".+")|('.+')$/.test(rawQuery)) {
    return { query: lowerCase(rawQuery), exactPhrase: true }
  }

  // Otherwise, we will use the `queryString` operator...
  // @see https://www.mongodb.com/docs/atlas/atlas-search/queryString/

  // 1. Remove special characters except for parenthesis and colon
  let query = rawQuery.replace(/[^a-z:\s()[\]]/gi, '').trim()
  let error

  // 2. Check for logical operators and prefixed search terms
  const operators = query.match(/(AND)|(OR)|(NOT)/g) || []
  const prefixedTerms = query.match(/(author)|(content)|(tags):/gi) || []

  // 2. Check for invalid prefixes
  const supportedFields = ['content', 'author', 'tags']
  if (prefixedTerms.some(term => !supportedFields.includes(toLower(term)))) {
    error = `Query contains an invalid field prefix. Supported fields are ${supportedFields.join(
      ' | '
    )}`
  }

  // 3. Limit the number of operators and prefixes that can be included
  if (operators.length > 5 || prefixedTerms.length > 3 || query.length > 150) {
    error = 'Query exceeded maximum length. See documentation for limits'
  }

  // Search both content and tags
  if (query.includes('content:')) {
    const keywords = /content:((\w+)|(\([\w ]+\)))/i
    query = query.replace(keywords, (_, m) => `(content:${m} OR tags:${m} )`)
  }

  return { query, error }
}

/**
 * Gets random quotes matching the given parameters and returns an array of
 * results
 *
 * @param {Object} params
 * @param {string} [params.query] A search query consisting of one or more
 *     keywords. This will filter the collection of quotes using a full
 *     text search. The method will then return n random quotes matching
 *     the given query.
 * @param {string} [params.tags] List of tags separated by comma or pipe
 * @param {string} [params.authorSlug] One or more author slugs (pipe separated)
 * @param {string} [params.minLength] minimum quote length in characters
 * @param {string} [params.maxLength] maximum quote length in characters
 */
export async function getRandomQuotes(params, next) {
  try {
    const {
      minLength,
      maxLength,
      tags,
      author,
      authorId,
      authorSlug,
      limit = 1,
      query: rawQuery = '',
      enableAdvancedQuery = true,
    } = params

    const defaultFields = ['content', 'tags']
    const { query, error } = parseQuery(rawQuery, defaultFields)

    // $search query
    let $search = {}

    if (error) {
      return next(400, error)
    }

    // Let `size` be the number of random quotes to retrieve
    const size = clamp(parseInt(limit), 1, MAX_RANDOM_COUNT)

    // If a `query` parameter was provided, we use $search to select matching
    // quotes. Then, we return `n` random documents from the results
    if (query) {
      if (enableAdvancedQuery) {
        // [Experimental] Advanced search queries.
        // @see https://www.mongodb.com/docs/atlas/atlas-search/queryString/
        // - The default search field is 'content'
        // - Query can include one or more prefixed search terms that target a
        //   specific field using the syntax `<field>:<search term>` (for
        //   example `query=author:john`)
        // - Query can include logical operators AND, OR, NOT
        // - Parenthesis can be used to group expressions and terms
        // - These features can be combined to form complex queries.
        //   Example: `query=author:adams AND (freedom OR justice)`
        //   This will match quotes with an author name that includes "adams"
        //   AND content that matches the terms "freedom" or "justice"
        $search = {
          queryString: { defaultPath: 'content', query },
        }
      } else {
        // Basic queries
        // For regular queries that don't include logical operators or field
        // prefixes, we search 'content' and `tags` using standard text search
        // This will return all quotes that match at least one search term
        $search = {
          text: { path: defaultFields, query },
        }
      }
    }

    // Filter parameters
    const $match = {}

    if (minLength || maxLength) {
      $match.length = getLengthFilter(minLength, maxLength)
    }

    if (tags) {
      $match.tags = getTagsFilter(tags)
    }

    if (authorId) {
      // @deprecated
      // Use the `author` param to filter by author `name` or `slug` instead
      $match.authorId = { $in: authorId.split('|') }
    }

    if (author) {
      if (/,/.test(author)) {
        // If `author` is a comma-separated list, respond with an error
        const message = 'Multiple authors should be separated by a pipe.'
        return next(createError(400, message))
      }
      // Filter quotes by author slug.
      $match.authorSlug = { $in: author.split('|').map(slug) }
    }

    if (authorSlug) {
      // @deprecated
      // use `author` param instead
      $match.authorSlug = { $in: author.split('|').map(slug) }
    }

    const results = await Quotes.aggregate(
      compact([
        // The $search stage (if a query param was provided)
        !isEmpty($search) && { $search },
        // Apply filters (if any)
        { $match },
        // Select `n` random quotes from the results, where `n` = `limit`
        { $sample: { size } },
        // Remove hidden properties
        { $project: { __v: 0, authorId: 0 } },
      ])
    )
    return results
  } catch (error) {
    return next(error)
  }
}

/**
 * Controller for the `/quotes/random` endpoint
 * 
 * - Gets n random quotes matching the given parameters. 
 * - Response is an array of Quote objects. 
 * - Responds with an empty array (no error) if no matching quotes are found
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

 * Responds with an empty array if no quotes match the given parameters
 */
export default async function randomQuotes(req, res, next) {
  const results = await getRandomQuotes(req.query, next)
  res.status(200).json(results)
}
