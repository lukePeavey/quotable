const { Schema, model } = require('mongoose')
const shortid = require('shortid')

const QuoteSchema = new Schema({
  _id: { type: String, default: shortid.generate },
  content: { type: String, required: true },
  author: { type: String, required: true },
  authorId: { type: String, required: true },
})

const Quotes = model('Quote', QuoteSchema)

module.exports = Quotes
