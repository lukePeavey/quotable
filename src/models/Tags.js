const { Schema, model } = require('mongoose')
const shortid = require('shortid')

const TagSchema = new Schema({
  _id: { type: String, default: shortid.generate },
  name: { type: String, required: true },
})

// To support full text search
TagSchema.index({ name: 'text' })

module.exports = model('Tag', TagSchema)
