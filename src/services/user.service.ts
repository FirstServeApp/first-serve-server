import { IUser, UserModel } from '../models/user.model.js'
import { ApiError } from '../middlewares/error.middleware.js'
import { removeTokenByUser } from './token.service.js'
import { Schema, startSession } from 'mongoose'
import { MatchModel, SetModel } from '../models/match.model.js'
import { OTPModel } from '../models/otp.model.js'
import { deleteImage, uploadImage } from './image.service.js'
import getCloudinaryPublicId from '../utils/cloudinary.utils.js'
import { IUserDto, UserDto } from '../dtos/user.dto.js'
import { ISocialUser, SocialUserModel } from '../models/socialUser.model.js'


const deleteAccount = async (id: Schema.Types.ObjectId) => {
  const session = await startSession()

  try {
    await session.withTransaction(async () => {
      const user = await UserModel.findById(id).session(session).exec() as IUser
      if (!user) {
        throw ApiError.NotFound('User not found')
      }

      if (user.avatar) {
        await deleteImage(user.avatar)
      }

      await UserModel.deleteOne({ _id: id }).session(session)
      await OTPModel.deleteMany({ user_id: id }).session(session)
      const matches = await MatchModel.find({ user_id: id }).session(session).exec()
      const sets = matches.map((match) => match.sets).flat()
      await SetModel.deleteMany({ _id: { $in: sets } }).session(session)
      await MatchModel.deleteMany({ user_id: id }).session(session)
      await removeTokenByUser(id, session)
    })
  } catch (e) {
    if (session && session.inTransaction()) {
      await session.abortTransaction()
    }

    throw ApiError.ServerError(e)
  } finally {
    await session.endSession()
  }
}

const changeProfileImage = async (userId: Schema.Types.ObjectId, newImage: any) => {
  const userData = await UserModel.findById(userId) as IUser
  const socialUserData = await SocialUserModel.findById(userId) as ISocialUser
  if (!userData && !socialUserData) {
    throw ApiError.NotFound('User not found')
  }

  const user = userData || socialUserData

  if (!user.avatar) {
    const imageUrl = await uploadImage(newImage)
    await user.updateOne({ avatar: imageUrl })
    return imageUrl
  }

  const publicId = getCloudinaryPublicId(user.avatar)
  const imageUrl = await uploadImage(newImage, publicId)
  await user.updateOne({ avatar: imageUrl })
  return imageUrl
}

const getCurrentUser = async (user: IUserDto) => {
  const userData = await UserModel.findById(user._id).exec()
  const socialUserData = await SocialUserModel.findById(user._id).exec()

  if (socialUserData) {
    return new UserDto(socialUserData)
  }

  if (userData) {
    return new UserDto(userData)
  }

  throw ApiError.NotFound('User not found')
}

const changeUserName = async (name: string, userId: Schema.Types.ObjectId) => {
  const user = await UserModel.findByIdAndUpdate(userId, { name }, { new: true }) as IUser
  const socialUser = await SocialUserModel.findByIdAndUpdate(userId, { name }, { new: true }) as ISocialUser
  return new UserDto(user || socialUser)
}

export {
  deleteAccount,
  changeProfileImage,
  getCurrentUser,
  changeUserName,
}
