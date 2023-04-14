import { capitalize, words } from 'lodash-es'

/**
 * Convert a string to title case, where the words are separated by a space,
 * the first letter of each word is capitalized, and all other characters are
 * lower case.
 */
export default function titleCase(str) {
  return words(str).map(capitalize).join(' ')
}
