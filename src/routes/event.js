import express from 'express'
import { Event } from '../models/event.js'

const router = express.Router()

// GET - Get all events
router.get('/all', async (_, res) => {
  try {
    res.status(200).json({ results: await Event.find() })
  } catch (error) {
    res.status(500).json({ error: error })
  }
})

// POST - Create new event
router.post('/create', async (req, res) => {
  try {
    let event = await Event.create({
      ...req.body,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate)
    })
    res.status(201).json({ event })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error })
  }
})

// PATCH - Update event
router.patch('/update', async (req, res) => {
  try {
    let event = await Event.findOneAndUpdate(req.query, req.body, { new: true })
    res.status(201).json({ event })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error })
  }
})

// DELETE - Delete event
router.delete('/delete', async (req, res) => {
  try {
    let event = await Event.findOneAndDelete(req.query)
    res.status(200).json({ event })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error })
  }
})

export default router
