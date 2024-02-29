import { model, Schema } from 'mongoose'

const GymEventSchema = new Schema({
  start: Date,
  startStr: String,
  end: Date,
  endStr: String,
  title: String,
  user: String,
  name: String,
  others: Object
}, {
  collection: 'gymEvent',
  minimize: false
})

export const GymEvent = model('GymEvent', GymEventSchema)
