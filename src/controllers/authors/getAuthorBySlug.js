const createError = require('http-errors')
const Authors = require('../../models/Authors')
const Quotes = require('../../models/Quotes')

/**
 * Get a single author by slug
 */
module.exports = async function getAuthorById(req, res, next) {
  try {
    const { slug } = req.params

    if (!slug) {
      return next(createError(422, 'Slug is required'))
    }
    // Get the author
    const author = await Authors.findOne({ slug: `${slug}` }).select(
      '-__v -aka'
    )

    if (!author) {
      return next(createError(404, 'The requested resource could not be found'))
    }
    // Get quotes by this author
    const quotes = await Quotes.find({ authorId: author._id }).select(
      '-__v -authorId'
    )

    res.status(200).json({
      _id: author._id,
      name: author.name,
      quoteCount: author.quoteCount,
      quotes,
    })
  } catch (error) {
    return next(error)
  }
}
