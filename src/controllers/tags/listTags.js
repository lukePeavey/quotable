const Tags = require('../../models/Tags')
const parseSortOrder = require('../utils/parseSortOrder')

module.exports = async function listTags(req, res, next) {
  try {
    let { sortBy, sortOrder } = req.query

    // Supported parameter values
    const Values = { sortBy: ['name', 'quoteCount'] }
    // The default sort order depends on the `sortBy` field
    const defaultSortOrder = { name: 1, quoteCount: -1 }

    sortBy = Values.sortBy.includes(sortBy) ? sortBy : 'name'
    sortOrder = parseSortOrder(sortOrder) || defaultSortOrder[sortBy] || 1

    const results = await Tags.aggregate([
      {
        $lookup: {
          from: 'quotes',
          localField: 'name',
          foreignField: 'tags',
          as: 'quoteCount',
        },
      },
      { $addFields: { quoteCount: { $size: '$quoteCount' } } },
      { $sort: { [sortBy]: sortOrder } },
    ])
    res.json(results)
  } catch (error) {
    return next(error)
  }
}
