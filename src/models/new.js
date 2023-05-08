import { model, Schema } from 'mongoose'

const NewSchema = new Schema({
  title: String,
  body: String,
  googleId: String
}, {
  collection: 'new',
  minimize: false
})

export const New = model('New', NewSchema)
