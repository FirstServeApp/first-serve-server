import { Router } from 'express'
import {
  createMatchController,
  getMatchController,
  deleteMatchController,
  getMatchesByUserController,
  getMatchesByDateController,
  getMatchesByPlayersController,
  getMatchDetailsController,
  changeOpponentNameController,
  getAllPlayersByUserController,
} from '../controllers/match.controller.js'
import {
  validateCreateMatchBody,
  validateRequestParamId,
  validateDateFilterQuery,
  validatePlayersFilterQuery,
  validateChangeOpponentNameSchema,
  validateGetAllMatchesQuery,
} from '../validations/match.validation.js'
import checkAuth from '../middlewares/auth.middleware.js'
import isAuthor from '../middlewares/isAuthor.middleware.js'

const router = Router()

router.post('/create', checkAuth, validateCreateMatchBody, createMatchController)
router.get('/all', checkAuth, validateGetAllMatchesQuery, getMatchesByUserController)
router.get('/all/players', checkAuth, getAllPlayersByUserController)
router.get('/filter/date', checkAuth, validateDateFilterQuery, getMatchesByDateController)
router.get('/filter/players', checkAuth, validatePlayersFilterQuery, getMatchesByPlayersController)
router.get('/:id', checkAuth, validateRequestParamId, isAuthor, getMatchController)
router.delete('/:id', checkAuth, validateRequestParamId, isAuthor, deleteMatchController)
router.get('/details/:id', checkAuth, validateRequestParamId, getMatchDetailsController)
router.patch('/change/:id', checkAuth, isAuthor, validateChangeOpponentNameSchema, changeOpponentNameController)

export default router
