const Tags = require('../../models/Tags')

/**
 * Get list of tags from the database.
 */
module.exports = async function listTags(req, res, next) {
  try {
    const results = await Tags.find({}).select('name')

    res.status(200).json({
      count: results.length,
      results,
    })
  } catch (error) {
    return next(error)
  }
}
