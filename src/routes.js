const { Router } = require('express')
const random = require('lodash/random')
const clamp = require('lodash/clamp')
const escapeRegExp = require('lodash/escapeRegExp')
const escape = require('lodash/escape')
const createError = require('http-errors')
const Quotes = require('./models/Quotes')
const Authors = require('./models/Authors')

// Create a router
const router = Router()

/**
 * Get a single random quote
 */
router.get('/random', async (req, res, next) => {
  try {
    const documentCount = await Quotes.estimatedDocumentCount()
    const index = random(0, documentCount - 1)
    const entry = await Quotes.find({})
      .limit(1)
      .skip(index)
      .select('content author')
    if (!entry || !entry[0]) {
      return next(createError(500, `Invalid random index: \`${index}\``))
    }
    res.status(200).json(entry[0])
  } catch (error) {
    return next(error)
  }
})

/**
 * Get multiple quotes from the database.
 *
 * @param {Object} req
 * @param {Object} req.query
 * @param {string} [req.query.author] Get quotes by the author name. This
 *     supports "fuzzy search", so the input can be a first name, last name
 *     or partial name and it will return all matching quotes.
 * @param {string} [req.query.authorId] Get quotes authorId
 * @param {number} [req.query.limit = 20] The max number of items to return
 * @param {number} [req.query.skip = 0] The offset for pagination
 */
router.get('/quotes', async (req, res, next) => {
  try {
    const { author, authorId } = req.query
    let { limit, skip } = req.query
    // Filters...
    const query = {}
    if (author) {
      // Search for quotes by author name (uses "fuzzy" matching)
      query.author = new RegExp(escapeRegExp(author), 'gi')
    } else if (authorId) {
      // Get quotes by author ID
      query.authorId = authorId
    }
    // Sorting...
    // For now, sort by _id.
    const sortByField = '_id'
    const sortOrder = 'ascending'

    // Pagination...
    limit = clamp(parseInt(limit), 1, 50) || 20
    skip = clamp(parseInt(skip), 1e4) || 0

    const results = await Quotes.find(query)
      .sort({ [sortByField]: sortOrder })
      .limit(limit)
      .skip(skip)
      .select('content author')
    res.status(200).json({
      count: results.length,
      totalCount: await Quotes.estimatedDocumentCount(),
      lastItemIndex: skip + results.length,
      results,
    })
  } catch (error) {
    return next(error)
  }
})

/**
 * Get authors
 *
 * @param {Object} req
 * @param {Object} req.query
 * @param {string} [req.query.name] Search for authors by name.
 * @param {'name' | 'quoteCount'} [req.query.sortBy]
 * @param {'asc' | 'desc'} [req.query.sortOrder = 'asc']
 * @param {number} [req.query.limit = 20] The max number of items to return
 * @param {number} [req.query.skip = 0] The offset for pagination
 */
router.get('/authors', async (req, res, next) => {
  try {
    const { name } = req.query
    let { sortBy, sortOrder, limit, skip } = req.query
    // Filters...
    const query = {}
    if (name) {
      query.name = new RegExp(escapeRegExp(name), 'gi')
    }
    // Sorting...
    sortBy = /^(name|quoteCount)$/.test(sortBy) ? sortBy : 'name'
    sortOrder = /^(desc)/.test(sortOrder) ? 'descending' : 'ascending'
    // Pagination...
    limit = clamp(parseInt(limit), 1, 50) || 20
    skip = clamp(parseInt(skip), 1e4) || 0

    const results = await Authors.find(query)
      .sort({ [sortBy]: sortOrder })
      .limit(limit)
      .skip(skip)
      .select('name quoteCount')
    const totalCount = await Authors.estimatedDocumentCount()
    const count = results.length
    res.status(200).json({ count, totalCount, results })
  } catch (error) {
    return next(error)
  }
})

/**
 * Get all quotes a given author
 */
router.get('/author/:id', async (req, res, next) => {
  const id = escape(req.params.id)

  if (!id) {
    return next(createError(422, 'ID is required'))
  }
  // Get the author by ID
  const author = await Authors.findById(id).select('name quoteCount')
  if (!author) {
    return next(createError(404, 'The requested resource could not be found'))
  }
  // Get all quotes by this author
  const quotes = await Quotes.find({ authorId: id }).select('content author')

  res.status(200).json({
    _id: author._id,
    name: author.name,
    quoteCount: author.quoteCount,
    quotes,
  })
})

/**
 * Get a quote by its ID
 */
router.get('/quotes/:id', async (req, res, next) => {
  const id = escape(req.params.id)

  // Get the author by ID
  const quote = await Quotes.findById(id).select('content author')
  if (!quote) {
    return next(createError(404, 'The requested resource could not be found'))
  }
  res.status(200).json({
    _id: quote._id,
    content: quote.content,
    author: quote.author,
  })
})

module.exports = router
