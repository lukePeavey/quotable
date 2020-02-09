const { Schema, model } = require('mongoose')
const shortid = require('shortid')

const TagSchema = new Schema({
  _id: { type: String, default: shortid.generate },
  name: { type: String, required: true },
})

TagSchema.index({ name: 1 }, { name: 'nameIndex' })

module.exports = model('Tag', TagSchema)
