import { Response, NextFunction, Request } from 'express'
import JoiValidation from 'express-joi-validation'
import { uploadImage, deleteImage } from '../services/image.service.js'
import { DeleteImageRequestSchema } from '../validations/image.validation.js'
import { ApiError } from '../middlewares/error.middleware.js'


const uploadController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { file } = req
  try {
    if (!file) {
      return next(ApiError.BadRequest('Image file not found in the request or field name is incorrect.'))
    }

    const result = await uploadImage(file.path)

    return res.json(result)
  } catch (e) {
    next(e)
  }
}

const deleteImageController = async (
  req: JoiValidation.ValidatedRequest<DeleteImageRequestSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await deleteImage(req.params.url)

    return res.json(result)
  } catch (e) {
    next(e)
  }
}

export {
  uploadController,
  deleteImageController,
}
