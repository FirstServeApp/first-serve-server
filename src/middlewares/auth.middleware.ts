import { NextFunction, Request, Response } from 'express'
import { ApiError } from './error.middleware.js'
import { validateAccessToken } from '../services/token.service.js'
import { IUserDto } from '../dtos/user.dto.js'


const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.headers.authorization?.split(' ')[1]
    if (!accessToken) {
      return next(ApiError.Unauthorized())
    }

    const userData = await validateAccessToken(accessToken)
    if (!userData) {
      return next(ApiError.Unauthorized())
    }

    req.user = userData as IUserDto
    next()
  } catch (e) {
    return next(ApiError.Unauthorized())
  }
}

export default checkAuth
