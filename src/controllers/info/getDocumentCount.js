import createError from 'http-errors'
import Info from '../../models/Info.js'

/**
 * Get a single quote by its ID
 */
export default async function getDocumentCount(req, res, next) {
  try {
    const result = await Info.findOne()

    if (!result) {
      return next(createError(404, 'The requested resource could not be found'))
    }

    res.status(200).json(result.count)
  } catch (error) {
    return next(error)
  }
}
