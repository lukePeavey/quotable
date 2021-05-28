/**
 * Converts string, number, or boolean value to a boolean.
 *
 * @example
 * toBoolean(true)
 * // => true
 * toBoolean("true")
 * // => true
 * toBoolean(1)
 * // => true
 * toBoolean("1")
 *
 * toBoolean(false)
 * // => false
 * toBoolean("false")
 * // => false
 * toBoolean("0")
 * // => false
 * toBoolean(0)
 * // => false
 * toBoolean(null)
 * // => false
 * toBoolean(undefined)
 * // => false
 *
 */
export default function toBoolean(value) {
  const number = parseInt(value)
  const string = String(value)
  return !Number.isNaN(number)
    ? Boolean(number)
    : string.toLowerCase() === 'true'
}
