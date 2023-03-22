import { model, Schema } from 'mongoose'

const ImgSchema = new Schema({
  name: String,
  format: String,
  googleId: String
}, {
  collection: 'img',
  minimize: false
})

export const Img = model('Img', ImgSchema)
