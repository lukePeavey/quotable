import mongoose from 'mongoose'
import shortid from 'shortid'

const { Schema, model } = mongoose

const TagSchema = new Schema({
  _id: { type: String, default: shortid.generate },
  name: { type: String, required: true },
  // Timestamp when item was added
  dateAdded: { type: String },
  // Timestamp when item was last updated
  dateModified: { type: String },
})

TagSchema.index({ name: 1 }, { name: 'nameIndex' })

export default model('Tag', TagSchema)
