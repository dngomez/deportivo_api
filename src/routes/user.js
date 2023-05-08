import express from 'express'
import { hashSync, compare } from 'bcrypt'
import { User } from '../models/user.js'
import { generateToken, checkPermissions } from '../helpers/tokenHandler.js'
import { sendEmail } from '../helpers/mailer.js'
import { v4 as uuidv4 } from 'uuid'

const router = express.Router()
const passwordRecoveryUuid = []

// GET CURRENT
router.get('/', async (_, res) => {
  try {
    res.status(200).json({ results: await User.find() })
  } catch (error) {
    res.status(500).json({ error: error })
  }
})

// GET Coordinator by ID
router.get('/coordinator', async (req, res) => {
  try {
    let coord = await User.findOne(req.query)
    res.status(200).json({ result: {
      name: `${coord.first_name.split(' ')[0]} ${coord.last_name.split(' ')[0]}`,
      email: coord.email,
      image: coord.image
    } })
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
    role: (body.subscribed) ? "Member" : "User",
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

// Password recovery
router.post('/password_recovery', async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email }).exec()

    if (!Boolean(user))
    return res.status(404).json({
      error: 'Email not found'
    })

    let id = uuidv4()
    passwordRecoveryUuid.push({ id: id, email: user.email })
    setTimeout(() => passwordRecoveryUuid.shift(), 1000 * 60 * 60)

    sendEmail(
      user.email,
      "Reestablecer contraseña",
      `Hola ${user.first_name.split(" ")[0]}
      <br><br>
      Al parecer olvidaste tu contraseña y solicitaste reestablecerla.
      <br>
      Si no has sido tú, por favor ignora este correo.
      <br>
      En caso contrario, para reestablecer tu contraseña por favor ingresa al siguiente link:
      <br>
      <a href="https://cdeportivoaura.cl/password_reset/${id}">Reestablecer contraseña</a><br>`
    )

    res.status(200).json({
      message: "Password recovery email sent"
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error })
  }
})

// Password recovery update pass
router.post('/update_password', async (req, res) => {
  let email = passwordRecoveryUuid.filter(e => e.id === req.body.uuid)[0]?.email
  console.log(req.body)
  console.log(passwordRecoveryUuid)
  console.log(email)
  if (!Boolean(email)) return res.status(404).json({
    error: 'URL token expired'
  })

  var hash = hashSync(req.body.password.trim(), 10)
  let user = await User.findOneAndUpdate({ email: email }, { password: hash }, { new: true })
  if (!Boolean(user)) {
    return res.status(404).json({
      error: 'Email not found'
    })
  }

  return res.status(200).json({user: user})
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
