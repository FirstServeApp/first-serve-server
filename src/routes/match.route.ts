import { Router } from 'express'
import {
  createMatchController,
  getMatchController,
  deleteMatchController,
  getMatchesByUserController,
  getMatchesByDateController,
  getMatchesByPlayersController,
} from '../controllers/match.controller.js'
import {
  validateCreateMatchBody,
  validatePaginationQuery,
  validateRequestParamId,
  validateDateFilterQuery,
  validatePlayersFilterQuery,
} from '../validations/match.validation.js'
import checkAuth from '../middlewares/auth.middleware.js'
import isAuthor from '../middlewares/isAuthor.middleware.js'

const router = Router()

router.post('/create', checkAuth, validateCreateMatchBody, createMatchController)
router.get('/all', checkAuth, validatePaginationQuery, getMatchesByUserController)
router.get('/filter/date', checkAuth, validateDateFilterQuery, getMatchesByDateController)
router.get('/filter/players', checkAuth, validatePlayersFilterQuery, getMatchesByPlayersController)
router.get('/:id', checkAuth, validateRequestParamId, isAuthor, getMatchController)
router.delete('/:id', checkAuth, validateRequestParamId, isAuthor, deleteMatchController)

export default router
