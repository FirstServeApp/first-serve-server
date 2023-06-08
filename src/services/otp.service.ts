import { ApiError } from '../middlewares/error.middleware.js'
import { OTPModel } from '../models/otp.model.js'
import bcrypt from 'bcrypt'
import hashString from '../utils/crypto.utils.js'
import sendOTPMail from './mailer.service.js'

const generateOTP = async (userId: string, email: string) => {
  const otpCode = Math.random().toFixed(4).slice(2)
  const hashedOtpCode = await hashString(otpCode)

  await OTPModel.deleteMany({ user_id: userId })
  const otp = await OTPModel.create({ otp: hashedOtpCode, user_id: userId })

  await sendOTPMail(otpCode, email)

  return {
    id: otp._id,
  }
}

const verifyOTP = async (otp: string, id: string) => {
  const otpData = await OTPModel.findById(id)
  if (!otpData) {
    throw ApiError.NotFound('OTP not found')
  }

  const now = new Date().getTime()
  const createdAt = otpData.createdAt.getTime()
  const diffInMs = now - createdAt
  const isExpired = diffInMs > 15 * 60 * 1000 // 15 min
  if (isExpired) {
    throw ApiError.Gone('OTP has expired. Please request a new one.')
  }

  const result = await bcrypt.compare(otp, otpData.otp)
  if (!result) {
    throw ApiError.BadRequest('Incorrect OTP code')
  }

  otpData.isVerified = true
  await otpData.save()

  return result
}

const verifyAndDelete = async (id: string, session: any) => {
  const otpData = await OTPModel.findById(id).session(session).exec()
  if (!otpData) {
    throw ApiError.NotFound('OTP not found')
  } else if (!otpData.isVerified) {
    throw ApiError.Unauthorized('OTP code not verified, please verify the code first to proceed with password change')
  }

  await OTPModel.deleteMany({ user_id: otpData.user_id }).session(session)
  return otpData.user_id
}

export {
  generateOTP,
  verifyOTP,
  verifyAndDelete,
}
