const { Schema, model } = require('mongoose')
const shortid = require('shortid')

const AuthorSchema = new Schema({
  _id: { type: String, default: shortid.generate },
  // The authors full name
  name: { type: String, required: true },
  // A list of alternate names (for internal use)
  aka: { type: [String], default: [] },
  // The link to the authors WikiPedia page or website
  link: { type: String, default: '' },
  // A short description about the person
  bio: { type: String, default: '' },
  // The number of quotes by this author
  quoteCount: { type: Number, required: true },
  // URL safe version of the author name
  slug: { type: String, required: true },
})

AuthorSchema.set('collation', { locale: 'en_US', strength: 1 })
AuthorSchema.index({ name: 1 }, { name: 'nameIndex', unique: true })
AuthorSchema.index({ quoteCount: -1 }, { name: 'quoteCountIndex' })

module.exports = model('Author', AuthorSchema)
