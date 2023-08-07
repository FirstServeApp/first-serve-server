import JoiValidation from 'express-joi-validation'
import { Response, NextFunction } from 'express'
import {
  createMatch,
  getMatchById,
  deleteMatch,
  getMatchesByUser,
  getMatchesByDate,
  getMatchesByPlayers,
  getDetailsByMatch,
  changeOpponentName,
} from '../services/match.service.js'
import {
  MatchRequestSchema,
  GetByIdRequestSchema,
  DateFilterSchema,
  PlayersFilterSchema,
  PaginationQueryScema,
  ChangeOpponentNameSchema,
} from '../validations/match.validation.js'
import { IUserDto } from '../dtos/user.dto.js'
import { getDatesFromQuery, getPaginationDataFromQuery, getPlayersFromQuery } from '../utils/query.utils.js'

const createMatchController = async (
  req: JoiValidation.ValidatedRequest<MatchRequestSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { _id } = req.user as IUserDto
    const match = await createMatch({ ...req.body, user_id: _id })

    return res.json(match)
  } catch (e) {
    next(e)
  }
}

const getMatchController = async (
  req: JoiValidation.ValidatedRequest<GetByIdRequestSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const match = await getMatchById(req.params.id)

    return res.json(match)
  } catch (e) {
    next(e)
  }
}

const deleteMatchController = async (
  req: JoiValidation.ValidatedRequest<GetByIdRequestSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params

    return await deleteMatch(id).then(() => res.json({}))
  } catch (e) {
    next(e)
  }
}

const getMatchesByUserController = async (
  req: JoiValidation.ValidatedRequest<PaginationQueryScema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { _id } = req.user as IUserDto
    const { skip, limit } = getPaginationDataFromQuery(req.query)

    const matches = await getMatchesByUser(_id, skip, limit)

    return res.json(matches)
  } catch (e) {
    next(e)
  }
}

const getMatchesByDateController = async (
  req: JoiValidation.ValidatedRequest<DateFilterSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { fromDate, toDate } = getDatesFromQuery(req.query)
    const { skip, limit } = getPaginationDataFromQuery(req.query)
    const { _id } = req.user as IUserDto

    const matches = await getMatchesByDate(fromDate, toDate, _id, skip, limit)

    return res.json(matches)
  } catch (e) {
    next(e)
  }
}

const getMatchesByPlayersController = async (
  req: JoiValidation.ValidatedRequest<PlayersFilterSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { skip, limit } = getPaginationDataFromQuery(req.query)
    const players = getPlayersFromQuery(req.query)
    const { _id } = req.user as IUserDto

    const matches = await getMatchesByPlayers(players, _id, skip, limit)

    return res.json(matches)
  } catch (e) {
    next(e)
  }
}

const getMatchDetailsController = async (
  req: JoiValidation.ValidatedRequest<GetByIdRequestSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params

    const data = await getDetailsByMatch(id)

    return res.json(data)
  } catch (e) {
    next(e)
  }
}

const changeOpponentNameController = async (
  req: JoiValidation.ValidatedRequest<ChangeOpponentNameSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { opponentName } = req.body
    const { id } = req.params

    const data = await changeOpponentName(id, opponentName)

    return res.json(data)
  } catch (e) {
    next(e)
  }
}

export {
  createMatchController,
  getMatchController,
  deleteMatchController,
  getMatchesByUserController,
  getMatchesByDateController,
  getMatchesByPlayersController,
  getMatchDetailsController,
  changeOpponentNameController,
}
