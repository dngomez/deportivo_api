import { model, Schema } from 'mongoose'

const SportSchema = new Schema({
  name: String,
  spName: String,
  viewBox: String,
  strokeWidth: Number,
  rotate: Boolean,
  flip: Boolean,
  path: String,
  description: String,
  coordinator: Object
}, {
  collection: 'sport',
  minimize: false
})

export const Sport = model('Sport', SportSchema)
