import mongoose from 'mongoose'
import shortid from 'shortid'

const { Schema, model } = mongoose

const AuthorSchema = new Schema({
  _id: { type: String, default: shortid.generate },
  // A unique ID derived from the author's name.
  slug: { type: String, required: true },
  // The authors full name
  name: { type: String, required: true },
  // A list of alternate names (for internal use)
  aka: { type: [String], default: [] },
  // The link to the authors WikiPedia page or website
  link: { type: String, default: '' },
  // A brief biography of the author (typically 2 to 3 sentences)
  bio: { type: String, default: '' },
  // A short, one-line description of the author (typically 1 to 3 words)
  description: { type: String, default: '' },
  // The number of quotes by this author
  quoteCount: { type: Number, required: true },
  // Timestamp when item was added
  dateAdded: { type: String },
  // Timestamp when item was last updated
  dateModified: { type: String },
})

AuthorSchema.set('collation', { locale: 'en_US', strength: 1 })
AuthorSchema.index({ name: 1 }, { name: 'nameIndex', unique: true })
AuthorSchema.index({ quoteCount: -1 }, { name: 'quoteCountIndex' })

export default model('Author', AuthorSchema)
