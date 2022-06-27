import Tags from '../../models/Tags.js'
import getSortParams from '../utils/getSortParams.js'

export default async function listTags(req, res, next) {
  try {
    const { sortBy, sortOrder } = getSortParams(req.query, {
      default: { field: 'name', order: 1 },
      name: { field: 'name', order: 1 },
      quoteCount: { field: 'quoteCount', order: -1 },
      dateAdded: { field: 'dateAdded', order: -1 },
      dateModified: { field: 'dateModified', order: -1 },
    })

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
