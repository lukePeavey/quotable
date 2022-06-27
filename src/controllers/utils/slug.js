import { deburr, words, toLower } from 'lodash-es'

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
export default function slug(input) {
  const string = deburr(decodeURI(input)).replace(/['\u2019]/g, '')
  return words(string).map(toLower).join('-')
}
