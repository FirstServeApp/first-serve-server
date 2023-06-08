import express, { Router } from 'express'
import multer from 'multer'
import { deleteImageController, uploadController } from '../controllers/image.controller.js'
import { validateDeleteImageBody } from '../validations/image.validation.js'
import checkAuth from '../middlewares/auth.middleware.js'
import { storage } from '../services/image.service.js'

const router = Router()
const urlEncoded = express.urlencoded({ limit: '5mb', extended: false, parameterLimit: 1 })

const upload = multer({ storage })

router.post('/upload', urlEncoded, checkAuth, upload.single('image'), uploadController)
router.delete('/:url', checkAuth, validateDeleteImageBody, deleteImageController)

export default router
