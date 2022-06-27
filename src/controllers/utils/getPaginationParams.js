import { clamp } from 'lodash-es'
import { MAX_LIMIT, DEFAULT_LIMIT } from '../../constants.js'

/**
 * Processes pagination params for all endpoints.
 *
 * @param {Object} params query params
 * @return {{ skip: number, limit: number, page: number }}
 */
export default function getPaginationParams(params = {}) {
  // =================================================================
  // Current pagination API (page/limit)
  // =================================================================
  // `limit` is the number of results per page.
  //  Convert to an integer >= 1 and <= `MAX_LIMIT`. Otherwise set to `20`
  const limit = clamp(parseInt(params.limit), 1, MAX_LIMIT) || DEFAULT_LIMIT
  // `page` is the "page" of results to return.
  //  Convert value to an integer >= 1, otherwise set to `1`
  let page = Math.max(parseInt(params.page), 1) || 1
  // `skip` is the zero-based offset of the first result to return. This is
  // calculated from the page number and results per page.
  let skip = clamp((page - 1) * limit, 1e4)

  // =================================================================
  // Legacy pagination API (skip/limit)
  // =================================================================
  if (params.skip !== undefined) {
    // NOTE: the `skip` parameter has been deprecated (replaced by the `page`
    // param). But we still support it for backwards compatibility. If a value
    // is provided for the `skip` param, we ignore the `page` param (the two
    // cannot be used together).

    // `skip` is the zero based offset of the first result to return
    // Convert value to an integer >= 0 and <= 10000
    skip = clamp(parseInt(params.skip), 0, 1e4) || 0
    // The API response will still include the `page` and `totalPages`
    // properties. So we determine the current page number based on results per
    // page (`limit`) and offset (`skip`). Examples:
    // limit = 20 & skip =  0 => page = 1
    // limit = 20 & skip = 19 => page = 1
    // limit = 20 & skip = 20 => page = 2
    page = Math.floor(skip / limit) + 1
  }

  return { page, skip, limit }
}
