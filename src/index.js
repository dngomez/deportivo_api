import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import 'dotenv/config'
import mongoose from 'mongoose'

// Connect to database
let mongoUri = process.env.MONGO_URI ? process.env.MONGO_URI : "mongodb+srv://localhost:27017/admin"
mongoose.connect(process.env.MONGO_URI)
.then(_db => console.log(`Database is connected`))
.catch(err => {
  console.log(err)
  console.log("\n---------------------------------------")
  console.log("Exit web until DB is ready\n")
  return process.exit(22)
})

const app = express()

// Settings
app.set('port', process.env.SERVER_PORT)

// Cors settings
var corsOptions = {
  origin: process.env.CORS_ORIGINS ? JSON.parse(process.env.CORS_ORIGINS) : "http://localhost",
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// Middlewares
app.use(morgan('dev'))
app.use(express.json())
app.use(cors(corsOptions))

// Routes
import UserRoutes from './routes/user.js'
import EventRoutes from './routes/event.js'

app.use('/api/user', UserRoutes)
app.use('/api/event', EventRoutes)

// Static files
// app.use(express.static(path.join(__dirname, 'public')))

// Not found routes
app.get('*', (_req, res) => res.status(400).json({}))

// Starting the server
app.listen(app.get('port'), '0.0.0.0', () => {
  console.log(`Server on port ${app.get('port')}`)
})