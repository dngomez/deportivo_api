import express from 'express'
import { hashSync, compare } from 'bcrypt'
import { User } from '../models/user.js'
import { generateToken, checkPermissions } from '../helpers/tokenHandler.js'

const router = express.Router()

// GET CURRENT
router.get('/', async (_, res) => {
  try {
    res.status(200).json({ results: await User.find() })
  } catch (error) {
    res.status(500).json({ error: error })
  }
})

// User sign
router.post('/create', async (req, res) => {
  var body = req.body
  var hash = hashSync(body.password.trim(), 10)

  let created = await User.exists({ email: body.email.trim() })
  if (created) {
    return res.status(500).json({
      error: 'El correo ya se encuentra registrado'
    })
  }
  
  let user = await User.create({
    ...body,
    password: hash,
    created: new Date()
  })

  return res.status(201).json({
    user: user
  })
})


// User login
router.post('/login', async (req, res) => {
  let user = await User.findOne({ email: req.body.user.email }).exec()

  if (!Boolean(user))
    return res.status(404).json({
      error: 'Email not found'
    })

  compare(req.body.user.password, user.password, (err, valid) => {
    if (!valid)
      return res.status(404).json({
        error: 'Wrong credentials'
      })

    let token = generateToken(user)
    return res.status(200).json({
      user: user,
      token: token
    })
  })
})

// PATCH - Update user
router.patch('/update', async (req, res) => {
  try {
    if (!checkPermissions(req, "User"))
      return res.status(401).json({ error: "Permisos insuficientes" })
    let user = await User.findOneAndUpdate(req.query, req.body, { new: true })
    let token = generateToken(user)
    return res.status(200).json({
      user: user,
      token: token
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error })
  }
})

// GET IMAGE
router.get('/image', async (req, res) => {
  try {
    if (!checkPermissions(req, "User"))
      return res.status(401).json({ error: "Permisos insuficientes" })
    let user = await User.findOne(req.query).exec()
    return res.status(200).json({
      image: user.image
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error })
  }
})
export default router
