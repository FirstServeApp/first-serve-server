import jwt from 'jsonwebtoken'
import { getEnv } from '../utils/env.utils.js'
import { ApiError } from '../middlewares/error.middleware.js'
import { TokenModel } from '../models/token.model.js'
import { IUser } from '../models/user.model.js'
import { IUserDto, UserDto } from '../dtos/user.dto.js'
import { Schema } from 'mongoose'
import { ISocialUser } from '../models/socialUser.model.js'

type TokensPair = {
  accessToken: string;
  refreshToken: string;
}

export const generateTokens = async (user: IUser | ISocialUser, session?: any): Promise<TokensPair> => {
  try {
    const accessSecret = getEnv('JWT_ACCESS_SECRET')
    const refreshSecret = getEnv('JWT_REFRESH_SECRET')

    const payload = { ...new UserDto(user) }
    const accessToken = await jwt.sign(payload, accessSecret, { expiresIn: getEnv('JWT_ACCESS_LIFETIME') || '7 days' })
    const refreshToken = await jwt.sign(
      payload, refreshSecret,
      { expiresIn: getEnv('JWT_REFRESH_LIFETIME') || '90 days' },
    )

    const tokenData = await TokenModel.findOne({ user_id: user._id })
    if (tokenData) {
      await TokenModel.findByIdAndUpdate(tokenData._id, { refreshToken }, { new: true })
    } else {
      await TokenModel.insertMany({ user_id: user._id, refreshToken }, { session })
    }

    return {
      accessToken,
      refreshToken,
    }
  } catch (e) {
    throw ApiError.ServerError(e)
  }
}

export const removeToken = async (refreshToken: string) => {
  const token = await TokenModel.deleteOne({ refreshToken })
  if (token.deletedCount === 0) {
    throw ApiError.Unauthorized()
  }
}

export const removeTokenByUser = async (id: Schema.Types.ObjectId, session?: any) => {
  await TokenModel.deleteOne({ user_id: id }).session(session)
}

export const validateRefreshToken = async (refreshToken: string): Promise<IUserDto | null> => {
  try {
    const userData = await jwt.verify(refreshToken, getEnv('JWT_REFRESH_SECRET'))
    return userData as IUserDto
  } catch (e) {
    return null
  }
}

export const validateAccessToken = async (accessToken: string): Promise<IUserDto | null> => {
  try {
    const userData = await jwt.verify(accessToken, getEnv('JWT_ACCESS_SECRET'))
    return userData as IUserDto
  } catch (e) {
    return null
  }
}

export const findRefreshToken = async (refreshToken: string) => {
  const tokenData = await TokenModel.findOne({ refreshToken })
  return tokenData
}
