import titleCase from './titleCase.js'

export default function getTagsFilter(tags) {
  if (tags.includes('|')) {
    return { $in: tags.split('|').map(titleCase) }
  }

  return { $all: tags.split(',').map(titleCase) }
}
