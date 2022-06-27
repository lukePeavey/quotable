import { Router } from 'express'
import listQuotes from './controllers/quotes/listQuotes.js'
import getQuoteById from './controllers/quotes/getQuoteById.js'
import searchQuotes from './controllers/search/searchQuotes.js'
import searchAuthors from './controllers/search/searchAuthors.js'
import randomQuote from './controllers/quotes/randomQuote.js'
import listAuthors from './controllers/authors/listAuthors.js'
import getAuthorById from './controllers/authors/getAuthorById.js'
import getAuthorBySlug from './controllers/authors/getAuthorBySlug.js'
import listTags from './controllers/tags/listTags.js'

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
router.get('/search/authors', searchAuthors)

export default router
