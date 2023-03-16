import express from 'express'
import { Event } from '../models/event.js'
import { checkPermissions, getUserFromToken } from '../helpers/tokenHandler.js'

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
    if (!checkPermissions(req, "User"))
      return res.status(401).json({ error: "Permisos insuficientes" })
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
    let currentEvent = await Event.findOne(req.query).exec()
    console.log(getUserFromToken(req)?._id)
    console.log(currentEvent.user)
    if (getUserFromToken(req)?._id === currentEvent.user || checkPermissions(req, "Staff")) {
      let event = await Event.findOneAndUpdate(req.query, req.body, { new: true })
      return res.status(200).json({ event })
    } else {
      return res.status(401).json({ error: "Permisos insuficientes" })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error })
  }
})

// DELETE - Delete event
router.delete('/delete', async (req, res) => {
  try {
    let currentEvent = await Event.findOne(req.query).exec()
    if (getUserFromToken(req)?._id === currentEvent.user || checkPermissions(req, "Staff")) {
      let event = await Event.findOneAndDelete(req.query)
      res.status(200).json({ event })
    } else {
      return res.status(401).json({ error: "Permisos insuficientes" })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error })
  }
})

export default router
