const { Router } = require('express')
const listQuotes = require('./controllers/quotes/listQuotes')
const getQuoteById = require('./controllers/quotes/getQuoteById')
const randomQuote = require('./controllers/quotes/randomQuote')
const listAuthors = require('./controllers/authors/listAuthors')
const getAuthorById = require('./controllers/authors/getAuthorById')

const router = Router()

/**------------------------------------------------
 ** Quotes
 **-----------------------------------------------*/
router.get('/quotes', listQuotes)
router.get('/quotes/:id', getQuoteById)
router.get('/random', randomQuote)

/**------------------------------------------------
 ** Authors
 **-----------------------------------------------*/
router.get('/authors', listAuthors)
router.get('/authors/:id', getAuthorById)

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
