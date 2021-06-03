import Tags from '../../models/Tags'
import parseSortOrder from '../utils/parseSortOrder'

const SortFields = {
  name: 'name',
  quoteCount: 'quoteCount',
}

export default async function listTags(req, res, next) {
  try {
    const { sortBy: sortByInput, sortOrder: sortOrderInput } = req.query

    const sortBy = SortFields[sortByInput] || 'name'
    const sortOrder = parseSortOrder(sortOrderInput)

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
