import { IUser, UserModel } from '../models/user.model.js'
import { ApiError } from '../middlewares/error.middleware.js'
import { findRefreshToken, generateTokens, removeToken, validateRefreshToken } from './token.service.js'
import bcrypt from 'bcrypt'
import hashString from '../utils/crypto.utils.js'
import { Schema, startSession } from 'mongoose'
import { generateOTP, verifyAndDelete } from './otp.service.js'
import { SocialUserModel } from '../models/socialUser.model.js'


type SignupReq = {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

const signup = async (data: SignupReq) => {
  const session = await startSession()
  let tokens = {}

  try {
    await session.withTransaction(async () => {
      const { email, password } = data
      const candidate = await UserModel.findOne({ email }).session(session)
      if (candidate) {
        throw ApiError.BadRequest('User with this email already exists')
      }

      const hashedPassword = await hashString(password)

      const user = await new UserModel({ ...data, password: hashedPassword }).save({ session })

      tokens = await generateTokens(user, session)
    })

    return tokens
  } catch (e) {
    if (session && session.inTransaction()) {
      await session.abortTransaction()
    }

    if (e instanceof ApiError) {
      throw e
    }

    throw ApiError.ServerError(e)
  } finally {
    await session.endSession()
  }
}

const login = async (email: string, password: string) => {
  const user = await UserModel.findOne({ email })
  if (!user) {
    throw ApiError.BadRequest('Incorrect email or password')
  }

  const passwordMatches = await bcrypt.compare(password, user.password)
  if (!passwordMatches) {
    throw ApiError.BadRequest('Incorrect email or password')
  }

  const tokens = await generateTokens(user)
  return tokens
}

const logout = async (refreshToken: string) => {
  await removeToken(refreshToken)
}

const refresh = async (refreshToken: string) => {
  if (!refreshToken) {
    throw ApiError.Unauthorized()
  }

  const userData = await validateRefreshToken(refreshToken)
  const tokenFromDB = await findRefreshToken(refreshToken)
  if (!userData || !tokenFromDB) {
    throw ApiError.Unauthorized()
  }

  const user = await UserModel.findById(tokenFromDB.user_id).exec()
  const socialUser = await SocialUserModel.findById(tokenFromDB.user_id).exec()
  const tokens = await generateTokens(user as IUser || socialUser)
  return tokens
}

const sendOTP = async (email: string) => {
  const user = await UserModel.findOne({ email })
  if (!user) {
    throw ApiError.NotFound('User not found')
  }

  const res = await generateOTP(user._id.toString(), email)
  return res
}

const changePassword = async (password: string, id: string) => {
  const session = await startSession()

  try {
    await session.withTransaction(async () => {
      const userId = await verifyAndDelete(id, session)
      const hashedPassword = await hashString(password)

      await UserModel.updateOne({ _id: userId }, { password: hashedPassword }).session(session)
    })
  } catch (e) {
    if (session && session.inTransaction()) {
      await session.abortTransaction()
    }

    if (e instanceof ApiError) {
      throw e
    }

    throw ApiError.ServerError(e)
  } finally {
    await session.endSession()
  }
}

const resetPassword = async (password: string, userId: Schema.Types.ObjectId) => {
  const session = await startSession()
  let tokens = {}

  try {
    await session.withTransaction(async () => {
      const user = await UserModel.findById(userId).session(session)
      if (!user) {
        throw ApiError.NotFound('User not found')
      }

      user.password = await hashString(password)
      const userData = await user.save({ session })
      tokens = await generateTokens(userData, session)
    })

    return tokens
  } catch (e) {
    if (session && session.inTransaction()) {
      await session.abortTransaction()
    }

    if (e instanceof ApiError) {
      throw e
    }

    throw ApiError.ServerError(e)
  } finally {
    await session.endSession()
  }
}

export {
  signup,
  login,
  logout,
  refresh,
  sendOTP,
  changePassword,
  resetPassword,
}
