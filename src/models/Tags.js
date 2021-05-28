import { Schema, model } from 'mongoose'
import shortid from 'shortid'

const TagSchema = new Schema({
  _id: { type: String, default: shortid.generate },
  name: { type: String, required: true },
})

TagSchema.index({ name: 1 }, { name: 'nameIndex' })

export default model('Tag', TagSchema)
