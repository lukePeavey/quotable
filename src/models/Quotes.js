const { Schema, model } = require('mongoose')
const shortid = require('shortid')

const QuoteSchema = new Schema({
  _id: { type: String, default: shortid.generate },
  content: { type: String, required: true },
  author: { type: String, required: true },
  authorId: { type: String, required: true },
  tags: { type: [String], required: true },
  length: { type: Number, required: true },
})

// To support full text search
QuoteSchema.index({ content: 'text', author: 'text' }, { name: 'textIndex' })

module.exports = model('Quote', QuoteSchema)
