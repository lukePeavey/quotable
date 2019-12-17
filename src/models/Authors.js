const { Schema, model } = require('mongoose')
const shortid = require('shortid')

const AuthorSchema = new Schema({
  _id: { type: String, default: shortid.generate },
  name: { type: String, required: true },
  quoteCount: { type: Number, required: true },
})

AuthorSchema.set('collation', { locale: 'en_US', strength: 1 })
AuthorSchema.index({ name: 1 }, { name: 'nameIndex', unique: true })
AuthorSchema.index({ quoteCount: -1 }, { name: 'quoteCountIndex' })

module.exports = model('Author', AuthorSchema)
