import createError from 'http-errors'
import Quotes from '../../models/Quotes.js'
import Authors from '../../models/Authors.js'
import getTagsFilter from '../utils/getTagsFilter.js'
import getLengthFilter from '../utils/getLengthFilter.js'
import slug from '../utils/slug.js'

/**
 * Get a single random quote
 */
export default async function getRandomQuote(req, res, next) {
  try {
    const { minLength, maxLength, tags, author, authorId, authorSlug } =
      req.query

    const filter = {}

    if (minLength || maxLength) {
      filter.length = getLengthFilter(minLength, maxLength)
    }

    if (tags) {
      filter.tags = getTagsFilter(tags)
    }

    if (authorId) {
      // @deprecated
      // Use the `author` param to filter by author `name` or `slug` instead
      filter.authorId = { $in: authorId.split('|') }
    }

    if (author) {
      if (/,/.test(author)) {
        // If `author` is a comma-separated list, respond with an error
        const message = 'Multiple authors should be separated by a pipe.'
        return next(createError(400, message))
      }
      // Filter quotes by author slug.
      filter.authorSlug = { $in: author.split('|').map(slug) }
    }

    if (authorSlug) {
      // @deprecated
      // use `author` param instead
      filter.authorSlug = { $in: author.split('|').map(slug) }
    }

    const [result] = await Quotes.aggregate([
      // Apply filters (if any)
      { $match: filter },
      // Select a random document from the results
      { $sample: { size: 1 } },
      { $project: { __v: 0, authorId: 0 } },
    ])

    if (!result) {
      // This should only occur when using filter params
      const message = 'Could not find any matching quotes'
      return next(createError(404, message))
    }
    res.status(200).json(result)
  } catch (error) {
    return next(error)
  }
}
