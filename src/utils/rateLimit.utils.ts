import { rateLimit } from 'express-rate-limit'

const defaultOptions = {
  standardHeaders: true,
  legacyHeaders: false,
}

const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { message: 'Too many accounts created from this IP, please try again after an hour' },
  ...defaultOptions,
})

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2,
  ...defaultOptions,
})

const userLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  ...defaultOptions,
})

const imageLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  skipFailedRequests: true,
  ...defaultOptions,
})

export {
  signupLimiter,
  loginLimiter,
  userLimiter,
  imageLimiter,
}
