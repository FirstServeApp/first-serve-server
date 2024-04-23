import { MatchModel, SetModel, ISet, IMatch } from '../models/match.model.js'
import { Schema, startSession } from 'mongoose'
import { ApiError } from '../middlewares/error.middleware.js'
import {
  getAggressiveMargin,
  getBreakPointsStat,
  getForcedErrors,
  getServesPoints,
  getUnforcedErrors,
  getStat,
  getTotalReturnWon,
  getTotalServiceWon,
  getTotalWon,
  getWinners,
  getDoubleFaults,
  getSecondServes,
  getFirstServes,
  getSecondServeWon,
} from '../utils/match.utils.js'

export type CreateMatchReq = {
  user_id: Schema.Types.ObjectId;
  winner: string;
  opponentName: string;
  setsArr: ISet[];
  duration: number;
}

const createMatch = async (data: CreateMatchReq): Promise<IMatch> => {
  const session = await startSession()
  const setIds: Schema.Types.ObjectId[] = []
  let result = {}

  try {
    await session
      .withTransaction(async () => {
        const createdSets = await SetModel.insertMany(data.setsArr, { session })
        createdSets.map((set) => {
          setIds.push(set._id)
        })

        const match = await MatchModel.insertMany({
          user_id: data.user_id,
          winner: data.winner,
          opponentName: data.opponentName,
          sets: setIds,
          duration: data.duration,
        }, { session })

        result = await match[0].populate('sets')
      }, { writeConcern: { w: 'majority' }, readConcern: 'majority' })
  } catch (e) {
    if (session && session.inTransaction()) {
      await session.abortTransaction()
    }

    throw ApiError.ServerError(e)
  } finally {
    if (session && session.inTransaction()) {
      await session.endSession()
    }
  }

  return result as IMatch
}

const getMatchById = async (id: Schema.Types.ObjectId): Promise<IMatch> => {
  const match = await MatchModel.findById(id).populate('sets').exec()
  if (!match) {
    throw ApiError.NotFound('No match found with this id')
  }

  return match
}

const getMatchesCountByUser = async (userId: Schema.Types.ObjectId): Promise<number> => {
  const count = await MatchModel.count({ user_id: userId }).exec()

  return count
}

const getMatchesByUser = async (userId: Schema.Types.ObjectId, skip: number, limit: number): Promise<IMatch[]> => {
  const matches = await MatchModel
    .find({ user_id: userId })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .populate('sets', '-_id -__v -games')
    .exec()

  return matches
}

const deleteMatch = async (matchId: Schema.Types.ObjectId): Promise<void> => {
  const session = await startSession()

  try {
    await session.withTransaction(async () => {
      const match = await MatchModel.findById(matchId).session(session).exec()
      if (!match) {
        throw ApiError.NotFound('No match found with this id')
      }

      await SetModel.deleteMany({ _id: { $in: match.sets } }).session(session)
      await MatchModel.deleteOne({ _id: matchId }).session(session)
    })
  } catch (e) {
    if (session && session.inTransaction()) {
      await session.abortTransaction()
    }

    if (e instanceof ApiError) {
      throw e
    }

    throw ApiError.ServerError(e)
  } finally {
    await session.endSession()
  }
}

const getMatchesByDate = async (
  fromDate: Date,
  toDate: Date,
  userId: Schema.Types.ObjectId,
  skip: number,
  limit: number,
): Promise<IMatch[]> => {
  const matches = await MatchModel
    .find({
      user_id: userId,
      createdAt: { $gte: fromDate, $lte: toDate },
    })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .populate('sets', '-_id -__v -myServes -opponentServes')
    .exec()

  return matches
}

const getMatchesByPlayers = async (
  players: string[],
  userId: Schema.Types.ObjectId,
  skip: number,
  limit: number,
): Promise<IMatch[]> => {
  const matches = await MatchModel
    .find({
      user_id: userId,
      opponentName: { $in: players },
    })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .populate('sets', '-_id -__v -myServes -opponentServes')
    .exec()

  return matches
}

const getDetailsByMatch = async (id: string) => {
  const match = await getMatchById(id as unknown as Schema.Types.ObjectId)
  const sets = match.sets as unknown as ISet[]

  const aces = getStat(sets, 'Ace')
  const doubleFaults = getDoubleFaults(sets)
  const winners = getWinners(sets)
  const forcedErrors = getForcedErrors(sets)
  const unforcedErrors = getUnforcedErrors(sets)
  const totalWon = getTotalWon(sets)
  const totalServiceWon = getTotalServiceWon(sets)
  const totalReturnWon = getTotalReturnWon(sets)
  const firstServes = getFirstServes(sets)
  const secondServes = getSecondServes(sets)
  const firstServePointsWon = getServesPoints(sets, '1')
  const secondServePointsWon = getSecondServeWon(sets)
  const breakPointsWon = getBreakPointsStat(sets)
  const aggressiveMargin = getAggressiveMargin(sets)

  return {
    aces,
    doubleFaults,
    winners,
    forcedErrors,
    unforcedErrors,
    totalWon,
    totalServiceWon,
    totalReturnWon,
    firstServes,
    secondServes,
    firstServePointsWon,
    secondServePointsWon,
    breakPointsWon,
    aggressiveMargin,
  }
}

const changeOpponentName = async (id: string, opponentName: string) => {
  const match = await MatchModel.findByIdAndUpdate(id, { opponentName }, { new: true }).exec()
  if (!match) {
    throw ApiError.NotFound('No match found with this id')
  }

  return match
}

export {
  createMatch,
  getMatchById,
  deleteMatch,
  getMatchesCountByUser,
  getMatchesByUser,
  getMatchesByDate,
  getMatchesByPlayers,
  getDetailsByMatch,
  changeOpponentName,
}
