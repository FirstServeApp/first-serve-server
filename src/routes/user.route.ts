import express, { Router } from 'express'
import multer from 'multer'
import {
  deleteAccountController,
  changeProfileImageController,
  getCurrentUserController,
  changeNameController,
} from '../controllers/user.controller.js'
import checkAuth from '../middlewares/auth.middleware.js'
import { storage } from '../services/image.service.js'
import { validateChangeNameBody } from '../validations/user.validation.js'


const router = Router()
const urlEncoded = express.urlencoded({ limit: '5mb', extended: false, parameterLimit: 1 })
const upload = multer({ storage })

router.get('/', checkAuth, getCurrentUserController)
router.delete('/delete', checkAuth, deleteAccountController)
router.patch('/change/avatar', urlEncoded, checkAuth, upload.single('image'), changeProfileImageController)
router.patch('/change/name', checkAuth, validateChangeNameBody, changeNameController)

export default router
