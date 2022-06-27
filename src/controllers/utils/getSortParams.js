/**
 * Parses the `sortOrder` param.
 *
 * Takes the query params object from the API request, looks for an `order` or
 * `sortOrder` param (both are supported). If a valid order param was provided
 * it converts the value to a number (1 for ascending, -1 for descending).
 * Otherwise, it will return null.
 *
 * Supported values:
 * - "ascending" == "asc" == 1
 * - "descending" == "desc" == -1
 *
 * @param {Object} params The query params from the API request
 * @return {number | null} `1` for ascending or `-1` for descending
 */
function parseSortOrder(params = {}) {
  let value = params.sortOrder || params.order
  // If value is one of the supported keywords, convert to a number
  if (/^asc(ending)?$|^desc(ending)?$/.test(String(value))) {
    value = /^asc/.test(value) ? 1 : -1
  }
  return Math.abs(value) === 1 ? Number(value) : null
}

/**
 * Processes the sorting params for all endpoints. This function takes the query
 * params from the API request, and a configuration object that defines the
 * sorting options for a specific endpoint.
 *
 * @param {Object} params The query params from the API request
 * @param {{[key: string]: {field: string, order: number}}} config An object
 *     that defines the sorting options for a specific endpoint. The keys are
 *     the supported values for the `sortBy` param. The values are objects that
 *     define the `field` and default order for each sortBy value. The config
 *     object must also include a `default` property that defines the default
 *     sortBy field and order.
 * @return {{sortBy: string, sortOrder: number}} An object containing `sortBy`
 *     and `sortOrder`. These values can be passed directly in the mongodb query
 *
 * @example
 * // In this example, the endpoint supports two `sortBy` values: 'name' and
 * // `quoteCount.`  The default order for `name` is ascending (1) and the
 *
 * const { sortBy, sortOrder } = getSortParams(req.query, {
 *   default: { field: 'name', order: 1 },
 *   name: { field: 'name', order: 1 },
 *   quoteCount: { field: 'quoteCount', order: -1 },
 * }
 */
export default function getSortParams(params = {}, config = {}) {
  if (!config.default) {
    throw new Error('config object must include a "default" property')
  }
  const sortBy = config[params.sortBy]?.field || config.default.field
  const defaultOrder = config[params.sortBy]?.order || config.default.order
  const sortOrder = parseSortOrder(params) || defaultOrder
  return { sortBy, sortOrder }
}
