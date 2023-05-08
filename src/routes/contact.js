import express from 'express'
import { sendEmail } from '../helpers/mailer.js'

const router = express.Router()

// GET - Get all sports
router.post('/', async (req, res) => {
  try {
    let email = req.body.email
    let name = req.body.name
    let subject = req.body.subject
    let content = req.body.content

    sendEmail(
      "cdeportivoaura@gmail.com",
      `${subject} - Contacto Web`,
      `${name} [${email}] utilizó el formulario de contacto de la página web para escribir:<br><br>${content}`
    )

    res.status(200).json({
      message: "Email sent"
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error })
  }
})

export default router
