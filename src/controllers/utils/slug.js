const deburr = require('lodash/deburr')
const words = require('lodash/words')
const toLower = require('lodash/toLower')

/**
 * Converts the given `string` to a slug.
 * Same as lodash#kebabCase
 *
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the slug
 * @example
 *
 * slug('Foo Bar')
 * // => 'foo-bar'
 *
 * slug('foo mcBar')
 * // => 'foo-mc-bar'
 *
 * slug('John O'Reilly')
 * // => 'john-o-reilly'
 *
 * slug('Søren Kierkegaard')
 * // => 'soren-kierkegaard'
 */
module.exports = function slug(input) {
  const string = deburr(input).replace(/['\u2019]/g, '')
  return words(string).map(toLower).join('-')
}
