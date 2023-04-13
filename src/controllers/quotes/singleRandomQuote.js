import createError from 'http-errors'
import { getRandomQuotes } from './randomQuotes.js'

/**
 * Controller for the `/random` endpoint.
 *
 * - Gets a single random Quote matching the given parameters.
 * - Response is a single Quote object
 * - Responds with 404 error if no matching quotes are found
 */
export default async function singleRandomQuote(req, res, next) {
  req.query.limit = 1
  const [result] = await getRandomQuotes(req.query, next)
  if (!result) return next(createError(404))
  res.status(200).json(result)
}
