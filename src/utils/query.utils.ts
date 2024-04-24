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

const getPlayersFromQuery = (query: Query) => {
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
  if (!from || !to) {
    throw ApiError.BadRequest('Please specify a both `from` and `to` dates')
  }

  const fromDate = new Date(String(from))
  const toDate = new Date(String(to))

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
