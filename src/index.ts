import express, { Express } from 'express'
import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import morgan from 'morgan'
import mongoSanitize from 'express-mongo-sanitize'
import logger from './services/logger.service.js'

import errorMiddleware from './middlewares/error.middleware.js'

import authRouter from './routes/auth.route.js'
import userRouter from './routes/user.route.js'
import matchRouter from './routes/match.route.js'
import imageRouter from './routes/image.route.js'

import { connectDB } from './models/index.js'

const app: Express = express()
const PORT: number = Number(process.env.PORT) || 6060
app.use(morgan('dev'))

app.use(express.json({ limit: '10mb' }))
app.use(helmet())
app.use(cookieParser())
app.use(cors())

app.use(mongoSanitize({
  onSanitize: ({ req, key }) => {
    logger.warn(`This request[${key}] is sanitized`, req)
  },
}))

app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use('/match', matchRouter)
app.use('/image', imageRouter)

app.get('/', (req, res) => {
  res.send('firstServe server')
})

app.get('/health', (req, res) => {
  res.json({ success: true })
})

app.use(errorMiddleware)

const start = () => {
  try {
    connectDB()

    app.listen(PORT, () => {
      logger.info(`⚡️[server]: Server is running at http://localhost:${PORT}`)
    })
  } catch (err) {
    logger.error(err)
  }
}

start()
