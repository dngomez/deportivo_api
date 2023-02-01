import { model, Schema } from 'mongoose'

const EventSchema = new Schema({
  start: Date,
  startStr: String,
  end: Date,
  endStr: String,
  title: String,
  user: String,
  name: String,
  others: Object
}, {
  collection: 'event',
  minimize: false
})

export const Event = model('Event', EventSchema)
