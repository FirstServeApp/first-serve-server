import { Response, NextFunction, Request } from 'express'
import JoiValidation from 'express-joi-validation'
import {
  LoginRequestSchema,
  SignupRequestSchema,
  EmailRequestSchema,
  OTPRequestSchema,
  PasswordOTPRequestSchema,
  PasswordRequestSchema,
} from '../validations/auth.validation.js'
import {
  signup,
  login,
  logout,
  refresh,
  sendOTP,
  changePassword,
  resetPassword,
} from '../services/auth.service.js'
import tokenCookie from '../config/jwt.config.js'
import { verifyOTP } from '../services/otp.service.js'
import { ApiError } from '../middlewares/error.middleware.js'

const signupController = async (
  req: JoiValidation.ValidatedRequest<SignupRequestSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const tokens = await signup(req.body)

    return res.json(tokens)
  } catch (e) {
    next(e)
  }
}

const loginController = async (
  req: JoiValidation.ValidatedRequest<LoginRequestSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body

    const tokens = await login(email, password)
    res.cookie('refreshToken', tokens.refreshToken, tokenCookie)

    return res.json(tokens)
  } catch (e) {
    next(e)
  }
}

const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { refreshToken } = req.body

    await logout(refreshToken)
    res.clearCookie('refreshToken')
    return res.json({})
  } catch (e) {
    next(e)
  }
}

const refreshController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { refreshToken } = req.body

    const tokens = await refresh(refreshToken)
    res.cookie('refreshToken', tokens.refreshToken, tokenCookie)

    return res.json(tokens)
  } catch (e) {
    next(e)
  }
}

const forgotPasswordController = async (
  req: JoiValidation.ValidatedRequest<EmailRequestSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body
    const result = await sendOTP(email)

    res.json(result)
  } catch (e) {
    next(e)
  }
}

const verifyOTPController = async (
  req: JoiValidation.ValidatedRequest<OTPRequestSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { otpCode, id } = req.body
    await verifyOTP(otpCode, id)

    return res.json({})
  } catch (e) {
    next(e)
  }
}

const changePasswordController = async (
  req: JoiValidation.ValidatedRequest<PasswordOTPRequestSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { password, id } = req.body
    await changePassword(password, id)

    return res.json({})
  } catch (e) {
    next(e)
  }
}

const resetPasswordController = async (
  req: JoiValidation.ValidatedRequest<PasswordRequestSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { password } = req.body
    if (!req.user) {
      return next(ApiError.Unauthorized())
    }

    const tokens = await resetPassword(password, req.user._id)
    return res.json(tokens)
  } catch (e) {
    next(e)
  }
}

export {
  signupController,
  loginController,
  logoutController,
  refreshController,
  forgotPasswordController,
  verifyOTPController,
  changePasswordController,
  resetPasswordController,
}
