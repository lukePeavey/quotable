import { Router } from 'express'
import createError from 'http-errors'
import listQuotes from './controllers/quotes/listQuotes.js'
import getQuoteById from './controllers/quotes/getQuoteById.js'
import searchQuotes from './controllers/search/searchQuotes.js'
import searchAuthors from './controllers/search/searchAuthors.js'
import singleRandomQuote from './controllers/quotes/singleRandomQuote.js'
import randomQuotes from './controllers/quotes/randomQuotes.js'
import listAuthors from './controllers/authors/listAuthors.js'
import getAuthorById from './controllers/authors/getAuthorById.js'
import getAuthorBySlug from './controllers/authors/getAuthorBySlug.js'
import listTags from './controllers/tags/listTags.js'
import getDocumentCount from './controllers/info/getDocumentCount.js'

const router = Router()
// @private (for debugging purposes)
router.get('/internal/uip', (request, response) => response.send(request.ip))

router.get('/info/count', getDocumentCount)

/**------------------------------------------------
 ** Quotes
 **-----------------------------------------------*/
router.get('/quotes/random', randomQuotes)
router.get('/random', singleRandomQuote)

router.get('/quotes', listQuotes)
router.get('/quotes/:id', getQuoteById)

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
router.get('/search/authors', searchAuthors)

export default router
