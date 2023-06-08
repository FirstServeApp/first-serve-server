import { Response, NextFunction } from 'express'
import { googleAuth, facebookAuth, appleAuth } from '../services/socialAuth.service.js'
import JoiValidation from 'express-joi-validation'
import { SocialAuthRequestSchema } from '../validations/socialAuth.validation.js'

const googleAuthController = async (
  req: JoiValidation.ValidatedRequest<SocialAuthRequestSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = req.body
    const tokens = await googleAuth(data)

    res.json(tokens)
  } catch (e) {
    next(e)
  }
}

const facebookAuthController = async (
  req: JoiValidation.ValidatedRequest<SocialAuthRequestSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = req.body
    const tokens = await facebookAuth(data)

    res.json(tokens)
  } catch (e) {
    next(e)
  }
}

const appleAuthController = async (
  req: JoiValidation.ValidatedRequest<SocialAuthRequestSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = req.body
    const tokens = await appleAuth(data)

    res.json(tokens)
  } catch (e) {
    next(e)
  }
}

export {
  googleAuthController,
  facebookAuthController,
  appleAuthController,
}
