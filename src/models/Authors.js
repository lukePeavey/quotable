const { Schema, model } = require('mongoose')
const shortid = require('shortid')

const AuthorSchema = new Schema({
  _id: { type: String, default: shortid.generate },
  name: { type: String, required: true },
  quoteCount: { type: Number, required: true },
})

module.exports = model('Author', AuthorSchema)
