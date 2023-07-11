import { Response, NextFunction, Request } from 'express'
import JoiValidation from 'express-joi-validation'
import { ChangeNameRequestSchema } from '../validations/user.validation.js'
import { deleteAccount, changeProfileImage, getCurrentUser, changeUserName } from '../services/user.service.js'
import { ApiError } from '../middlewares/error.middleware.js'
import { IUserDto } from '../dtos/user.dto.js'
import { UserModel } from '../models/user.model.js'
import { SocialUserModel } from '../models/socialUser.model.js'
import { deleteSocialAccount } from '../services/socialAuth.service.js'


const deleteAccountController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user as IUserDto
    const userData = await UserModel.findById(user._id).exec()
    const socialUserData = await SocialUserModel.findById(user._id).exec()
    if (userData) {
      await deleteAccount(user._id)
    } else if (socialUserData) {
      await deleteSocialAccount(user._id)
    } else {
      next(ApiError.NotFound('User not found'))
    }

    res.clearCookie('refreshToken')

    return res.json({})
  } catch (e) {
    next(e)
  }
}

const changeProfileImageController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return next(ApiError.Unauthorized())
    }

    const { image } = req.body
    if (!image) {
      return next(ApiError.BadRequest('Image file not found in the request or field name is incorrect.'))
    }

    const imageUrl = await changeProfileImage(req.user._id, image)

    return res.json({ imageUrl })
  } catch (e) {
    next(e)
  }
}

const getCurrentUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user as IUserDto
    const userData = await getCurrentUser(user)

    return res.json(userData)
  } catch (e) {
    next(e)
  }
}

const changeNameController = async (
  req: JoiValidation.ValidatedRequest<ChangeNameRequestSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name } = req.body
    if (!req.user) {
      return next(ApiError.Unauthorized())
    }

    const user = await changeUserName(name, req.user._id)

    res.json(user)
  } catch (e) {
    next(e)
  }
}

export {
  deleteAccountController,
  changeProfileImageController,
  getCurrentUserController,
  changeNameController,
}
