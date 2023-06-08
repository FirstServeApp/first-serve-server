import { Request, Response, NextFunction } from 'express'
import { ApiError } from './error.middleware.js'
import { IUserDto } from '../dtos/user.dto.js'
import { MatchModel } from '../models/match.model.js'

const isAuthor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { _id } = req.user as IUserDto
    const matchId = req.params.id

    const match = await MatchModel.findById(matchId).exec()
    if (!match) {
      return next(ApiError.NotFound('No match found with this id'))
    }

    const isMatchAuthor = String(match.user_id) === String(_id)
    if (!isMatchAuthor) {
      return next(ApiError.Forbidden())
    }

    next()
  } catch (e) {
    return next(ApiError.ServerError(e))
  }
}

export default isAuthor
