import express from 'express'
import { hashSync, compare } from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../models/user.js'

const router = express.Router()

// Generate JSON web token based on user info
function generateToken(user) {
  let u = {
    _id: user._id.toString(),
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    birthday: user.birthday,
    subscribed: user.subscribed
  }

  return jwt.sign(u, process.env.JWT_SECRET || 'secretJWT', {
    expiresIn: 60 * 60 * 24 * 7 // expires in 7 day
  })
}

// GET CURRENT
router.get('/', async (_, res) => {
  try {
    res.status(200).json({ results: await User.find() })
  } catch (error) {
    res.status(500).json({ error: error })
  }
})

// User sign
router.post('/signup', async (req, res) => {
  var body = req.body
  var hash = hashSync(body.user.password.trim(), 10)

  let created = await User.exists({ username: body.user.email.trim() })
  if (created)
    return res.status(500).json({
      error: 'Username already taken'
    })
  
  let user = await User.create({
    ...body.user,
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

export default router
