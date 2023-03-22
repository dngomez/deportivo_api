import express from 'express'
import { Img } from '../models/img.js'

const router = express.Router()

// GET - Get all images
router.get('/all', async (_, res) => {
  try {
    res.status(200).json({ results: await Img.find() })
  } catch (error) {
    res.status(500).json({ error: error })
  }
})

export default router
