import { getEnv } from '../utils/env.utils.js'
import { CookieOptions } from 'express'

const isProduction = getEnv('NODE_ENV') === 'production'

const tokenCookie: CookieOptions = {
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  httpOnly: true,
  secure: isProduction,
}

export default tokenCookie
