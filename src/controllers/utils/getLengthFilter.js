/**
 * Takes `minLength` and `maxLength` and creates the query filter for quote
 * length.
 *
 * @param {number} [minLength = 0]
 * @param {number} [maxLength = 1e4]
 */
export default function getLengthFilter(minLength, maxLength) {
  return {
    $gte: Number(minLength) || 0,
    $lte: Number(maxLength) || 1e4,
  }
}
