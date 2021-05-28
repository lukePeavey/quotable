import { Router } from 'express'
import listQuotes from './controllers/quotes/listQuotes'
import getQuoteById from './controllers/quotes/getQuoteById'
import searchQuotes from './controllers/search/searchQuotes'
import searchAuthors from './controllers/search/searchAuthors'
import randomQuote from './controllers/quotes/randomQuote'
import listAuthors from './controllers/authors/listAuthors'
import getAuthorById from './controllers/authors/getAuthorById'
import getAuthorBySlug from './controllers/authors/getAuthorBySlug'

import listTags from './controllers/tags/listTags'

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
