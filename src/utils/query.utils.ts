import { Query } from 'express-serve-static-core'
import { ApiError } from '../middlewares/error.middleware.js'

const getPaginationDataFromQuery = (query: Query) => {
  const { page = 1, pageSize = 20 } = query
  const skip = (Number(page) - 1) * Number(pageSize)
  const limit = Number(pageSize)

  return {
    skip,
    limit,
  }
}

const getPlayersFromQuery = (query: Query): string[] => {
  const { players } = query
  if (!players) {
    // throw ApiError.BadRequest('Players array is required')
    return []
  }
  const playersArr = JSON.parse(decodeURIComponent(String(players)))

  return playersArr
}

const getDatesFromQuery = (query: Query) => {
  const { from, to } = query
  if ((from && !to) || (to && !from)) {
    throw ApiError.BadRequest('Please specify a both `from` and `to` dates')
  }

  const fromDate = from ? new Date(String(from)) : undefined
  const toDate = to ? new Date(String(to)) : undefined

  return {
    fromDate,
    toDate,
  }
}

export {
  getPaginationDataFromQuery,
  getPlayersFromQuery,
  getDatesFromQuery,
}
