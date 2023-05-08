import express from 'express'
import { New } from '../models/new.js'

const router = express.Router()

// GET - Get all images
router.get('/all', async (_, res) => {
  try {
    res.status(200).json({ results: await New.find().sort({date: "desc"}) })
  } catch (error) {
    res.status(500).json({ error: error })
  }
})

export default router
