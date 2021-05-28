export default function getTagsFilter(tags) {
  if (tags.includes('|')) {
    return { $in: tags.split('|') }
  }

  return { $all: tags.split(',') }
}
