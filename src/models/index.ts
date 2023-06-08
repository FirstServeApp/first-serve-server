import mongoose from 'mongoose'
import bluebird from 'bluebird'
import { getEnv } from '../utils/env.utils.js'
import logger from '../services/logger.service.js'

const DB_URL = getEnv('DB_URL')
export const connectDB = () => mongoose.connect(DB_URL)

mongoose
  .connection
  .on('connected', () => {
    logger.info('MongoDB connected')
  })
  .on('error', (error: Error) => {
    logger.error(error)
  })
  .on('disconnected', async () => {
    logger.warn('MongoDB connection was dropped, trying to reconnect...')
    await bluebird.delay(5000)
    await connectDB()
  })
