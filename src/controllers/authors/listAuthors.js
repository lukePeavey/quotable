const clamp = require('lodash/clamp')
const escapeRegExp = require('lodash/escapeRegExp')
const Authors = require('../../models/Authors')

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

    if (name) {
      // TODO: remove this param in favor of a separate search endpoint
      filter.name = new RegExp(escapeRegExp(name), 'gi')
    }

    // Supported parameter values
    const Values = {
      sortBy: ['name', 'quoteCount'],
      sortOrder: ['asc', 'desc', 'ascending', 'descending', '1', '-1'],
    }
    // The default order depends on the sortBy field.
    const defaultOrder = sortBy === 'quoteCount' ? -1 : 1

    sortBy = Values.sortBy.includes(sortBy) ? sortBy : 'name'
    sortOrder = Values.sortOrder.includes(sortOrder) ? sortOrder : defaultOrder
    limit = clamp(parseInt(limit), 1, 50) || 20
    skip = parseInt(skip) || 0

    // Fetch paginated results
    const results = await Authors.find(filter)
      .sort({ [sortBy]: sortOrder })
      .limit(limit)
      .skip(skip)
      .select('name quoteCount')
    // Total number of authors that match the query
    const totalCount = await Authors.countDocuments(filter)

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
