const clamp = require('lodash/clamp')
const escapeRegExp = require('lodash/escapeRegExp')
const Authors = require('../../models/Authors')
const parseSortOrder = require('../utils/parseSortOrder')

/**
 * List Authors
 *
 * @param {Object} req
 * @param {Object} req.query
 * @param {string} [req.query.name] Filter authors by name
 * @param {'name' | 'quoteCount'} [req.query.sortBy]
 * @param {'asc' | 'desc'} [req.query.sortOrder = 'asc']
 * @param {number} [req.query.limit = 20] The max number of items to return
 * @param {number} [req.query.skip = 0] The offset for pagination
 */
module.exports = async function listAuthors(req, res, next) {
  try {
    const { name } = req.query
    let { sortBy, sortOrder, limit, skip } = req.query
    const filter = {}

    // Supported parameter values
    const Values = { sortBy: ['name', 'quoteCount'] }
    // The default sort order depends on the `sortBy` field
    const defaultSortOrder = { name: 1, quoteCount: -1 }

    if (name) {
      // TODO: remove this param in favor of a separate search endpoint
      filter.name = new RegExp(escapeRegExp(name), 'gi')
    }

    sortBy = Values.sortBy.includes(sortBy) ? sortBy : 'name'
    sortOrder = parseSortOrder(sortOrder) || defaultSortOrder[sortBy] || 1
    limit = clamp(parseInt(limit), 1, 50) || 20
    skip = parseInt(skip) || 0

    // Fetch paginated results
    const [results, totalCount] = await Promise.all([
      Authors.find(filter)
        .sort({ [sortBy]: sortOrder })
        .limit(limit)
        .skip(skip)
        .select('-__v'),
      Authors.countDocuments(filter),
    ])

    // `lastItemIndex` is the offset of the last result returned by this
    // request. When paginating through results, this would be used as the
    // `skip` parameter when requesting the next page of results. It will be
    // set to `null` if there are no additional results.
    const lastItemIndex = skip + results.length

    // Return a paginated list of authors
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
