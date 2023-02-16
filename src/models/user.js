import { model, Schema } from 'mongoose'

const UserSchema = new Schema({
  first_name: String,
  last_name: String,
  email: String,
  password: String,
  birthday: Date,
  created: Date, 
  subscribed: Boolean,
  theme: String,
  role: String,
  image: {
    data: Buffer,
    contentType: String
  }
}, {
  collection: 'user',
  minimize: false
})

export const User = model('User', UserSchema)
