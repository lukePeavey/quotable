import clamp from 'lodash/clamp'
import createError from 'http-errors'
import slugify from '../utils/slug'
import Authors from '../../models/Authors'
import parseSortOrder from '../utils/parseSortOrder'

/**
 * Get all authors that match a given query. By default, this method returns
 * a paginated list of all authors in alphabetical order.
 *
 * @param {Object} req
 * @param {Object} req.query
 * @param {string} [req.query.name] Filter authors by name. The value can be a
 *     single name or a pipe-separated list of names.
 * @param {string} [req.query.slug] Filter authors by slug. The value can be a
 *     single slug or a pipe-separated list of slugs.
 * @param {'name' | 'quoteCount'} [req.query.sortBy]
 * @param {'asc' | 'desc'} [req.query.sortOrder = 'asc']
 * @param {number} [req.query.limit = 20] The max number of items to return
 * @param {number} [req.query.skip = 0] The offset for pagination
 */
export default async function listAuthors(req, res, next) {
  try {
    const { name, slug } = req.query
    let { sortBy, sortOrder, limit, skip, page } = req.query
    const filter = {}
    const nameOrSlug = name || slug

    // Supported parameter values
    const Values = { sortBy: ['name', 'quoteCount'] }
    // The default sort order depends on the `sortBy` field
    const defaultSortOrder = { name: 1, quoteCount: -1 }

    if (nameOrSlug) {
      // Filter authors by `slug` or `name`. Value can be a single slug/name or // a pipe-separated list of names.
      if (/,/.test(nameOrSlug)) {
        // If value is a comma-separated list, respond with error.
        const message = 'Multiple values should be separated by a pipe.'
        return next(createError(400, message))
      }
      filter.slug = nameOrSlug.split('|').map(slugify)
    }

    sortBy = Values.sortBy.includes(sortBy) ? sortBy : 'name'
    sortOrder = parseSortOrder(sortOrder) || defaultSortOrder[sortBy] || 1
    limit = clamp(parseInt(limit), 1, 150) || 20
    skip = parseInt(skip) || (parseInt(page) - 1) * limit || 0

    // Fetch paginated results
    const [results, totalCount] = await Promise.all([
      Authors.find(filter)
        .sort({ [sortBy]: sortOrder })
        .limit(limit)
        .skip(skip)
        .select('-__v -aka'),
      Authors.countDocuments(filter),
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

    // Return a paginated list of authors
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
