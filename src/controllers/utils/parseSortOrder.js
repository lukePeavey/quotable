/**
 * Parses a user supplied input for the `sortOrder` param. Returns the
 * corresponding numeric value or `null` (if `input` is invalid).
 *
 * Supported values:
 * - "asc" | "ascending" | "1"
 * - "desc" | "descending" | "-1"
 */
module.exports = function parseSortOrder(input) {
  let value = input
  // If value is one of the supported keywords ("asc", "ascending",
  // "desc", "descending"), convert it to the corresponding numeric value.
  if (/^asc(ending)?$|^desc(ending)?$/.test(String(value))) {
    value = /^asc/.test(input) ? 1 : -1
  }
  return Math.abs(value) === 1 ? Number(value) : null
}
