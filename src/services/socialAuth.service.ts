import { ISocialUser, SocialUserModel} from '../models/socialUser.model.js'
import { SetModel, MatchModel } from '../models/match.model.js'
import { generateTokens, removeTokenByUser } from './token.service.js'
import { ApiError } from '../middlewares/error.middleware.js'
import { startSession, Schema } from 'mongoose'
import { deleteImage } from './image.service.js'
import { SocialAuthIdNames } from '../validations/socialAuth.validation.js'

interface SocialAuthData {
  email: string;
  name: string;
  avatar?: string;
  googleId?: string;
  facebookId?: string;
  appleId?: string;
}

const socialAuth = async (fieldName: SocialAuthIdNames, data: SocialAuthData) => {
  const candidate = await SocialUserModel
    .findOne({ [fieldName]: data[fieldName] })

  if (candidate) {
    const tokens = await generateTokens(candidate)
    return tokens
  }

  const socialUser = await SocialUserModel.create(data)
  const tokens = await generateTokens(socialUser)
  return tokens
}

const googleAuth = async (data: SocialAuthData) => {
  const tokens = await socialAuth(SocialAuthIdNames.googleId, data)
  return tokens
}

const facebookAuth = async (data: SocialAuthData) => {
  const tokens = await socialAuth(SocialAuthIdNames.facebookId, data)
  return tokens
}

const appleAuth = async (data: SocialAuthData) => {
  const tokens = await socialAuth(SocialAuthIdNames.appleId, data)
  return tokens
}

const deleteSocialAccount = async (id: Schema.Types.ObjectId) => {
  const session = await startSession()

  try {
    await session.withTransaction(async () => {
      const user = await SocialUserModel.findById(id).session(session).exec() as ISocialUser

      if (!user) {
        throw ApiError.NotFound('User not found')
      }

      if (user.avatar) {
        await deleteImage(user.avatar)
      }

      await SocialUserModel.deleteOne({ _id: id }).session(session)
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

export {
  googleAuth,
  facebookAuth,
  appleAuth,
  deleteSocialAccount,
}
