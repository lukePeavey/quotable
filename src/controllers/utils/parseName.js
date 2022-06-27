import { words as toWords, toLower } from 'lodash-es'

// List of prefixes
const prefix = [
  'mr',
  'mrs',
  'ms',
  'miss',
  'saint',
  'general',
  'brother',
  'captain',
  'count',
  'countess',
  'dr',
  'duke',
  'father',
  'reverend',
  'rev',
  'sir',
  'sister',
]

// The list of suffixes
const suffix = [
  'Jr',
  'Sr',
  'I',
  'II',
  'III',
  'IV',
  'V',
  'MD',
  'DDS',
  'PhD',
  'DVM',
]

// A list of stop words commonly used in names
const stopwords = ['the', 'of', 'de']

// Array of regExps for prefixes, suffixes, stopwords
const regExps = [prefix, suffix, stopwords].map(
  list => new RegExp(`^(${list.join('|')})$`, 'i')
)

/**
 * Returns `true` if the given `word` is a search term. For this case,
 * search terms are all words except initials, prefixes, suffixes, and
 * stop words.
 *
 * @param {string} word
 * @returns {boolean}
 * @example
 * // Initials
 * isSecondaryTerm("L")     // => false
 * // Prefixes
 * isSecondaryTerm("Saint") // => false
 * // Suffixes
 * isSecondaryTerm("Jr")    // => false
 * // stop words
 * isSecondaryTerm("the")    // => false
 */
const isSearchTerm = word => {
  if (word.length <= 1) return false
  return !regExps.some(regExp => regExp.test(word))
}

/**
 * Breaks a name down into terms. Search terms are all words except initials,
 * prefixes, suffixes, and stop words.
 */
function parseName(str) {
  // The string (strip punctuation, convert to lowercase)
  const value = toLower(str)
  // Split the string into words
  const words = toWords(value).slice(0, 10)
  // Get search terms
  const terms = words.filter(isSearchTerm)
  return { terms, value }
}

export default parseName
