import express from 'express'
import { Sport } from '../models/sport.js'

const router = express.Router()

// GET - Get all sports
router.get('/all', async (_, res) => {
  try {
    res.status(200).json({ results: await Sport.find() })
  } catch (error) {
    res.status(500).json({ error: error })
  }
})

export default router
