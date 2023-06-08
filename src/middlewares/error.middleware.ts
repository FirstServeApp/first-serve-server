import { Response, Request, NextFunction } from 'express'
import logger from '../services/logger.service.js'
import Joi from 'joi'
import { ExpressJoiError } from 'express-joi-validation'

export class ApiError extends Error {
  status: number
  unknowError?: unknown

  constructor(status: number, message: string, unknowError?: unknown) {
    super(message)
    this.status = status
    this.unknowError = unknowError
  }

  static BadRequest(message: string) {
    return new ApiError(400, message)
  }

  static NotFound(message: string) {
    return new ApiError(404, message)
  }

  static ServerError(error: unknown) {
    return new ApiError(500, 'Internal Server Error', error)
  }

  static Unauthorized(message?: string) {
    return new ApiError(401, message || '401 Unauthorized')
  }

  static Forbidden() {
    return new ApiError(403, '403 Forbidden')
  }

  static Gone(message: string) {
    return new ApiError(410, message)
  }
}

const resJoiError = (err: Joi.ValidationError, res: Response) => {
  logger.warn(err)

  try {
    const errDetails = err.details[0]
    const errField = errDetails.path[0].toString()
    const errCode = errDetails.message || `${errField}: ${errDetails.type}`

    res.status(400).json({ message: errCode })
  } catch (e) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

const errorMiddleware = (err: Error | ExpressJoiError, _: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    if (err.status === 500) {
      logger.error(err.unknowError)
    }
    return res.status(err.status).json({ message: err.message })
  }

  const joiErr = err as ExpressJoiError
  if (joiErr && joiErr.error && joiErr.error.isJoi) {
    return resJoiError(joiErr.error, res)
  }

  logger.error(err)
  return res.status(500).json({ message: 'Internal Server Error' })
}

export default errorMiddleware
