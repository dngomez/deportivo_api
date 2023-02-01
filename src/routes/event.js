import express from 'express'
import { Event } from '../models/event.js'

const router = express.Router()

// GET - get all events
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

export default router
