const { Router } = require('express')
const listQuotes = require('./controllers/quotes/listQuotes')
const getQuoteById = require('./controllers/quotes/getQuoteById')
const searchQuotes = require('./controllers/search/searchQuotes')
const randomQuote = require('./controllers/quotes/randomQuote')
const listAuthors = require('./controllers/authors/listAuthors')
const getAuthorById = require('./controllers/authors/getAuthorById')
const listTags = require('./controllers/tags/listTags')

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
router.get('/authors/slug/:slug', getAuthorBySlug)

/**------------------------------------------------
 ** Tags
 **-----------------------------------------------*/
router.get('/tags', listTags)

/**------------------------------------------------
 ** Search
 **-----------------------------------------------*/
router.get('/search/quotes', searchQuotes)

module.exports = router
