import { Router } from 'express'
import {
  signupController,
  loginController,
  logoutController,
  refreshController,
  forgotPasswordController,
  verifyOTPController,
  changePasswordController,
  resetPasswordController,
} from '../controllers/auth.controller.js'
import {
  validateSignupBody,
  validateLoginBody,
  validateEmailRequest,
  validateOTPRequest,
  validateOTPPasswordRequest,
  validatePasswordRequest,
} from '../validations/auth.validation.js'
import {
  googleAuthController,
  facebookAuthController,
  appleAuthController,
} from '../controllers/socialAuth.controller.js'
import {
  validateGoogleAuthBody,
  validateFacebookAuthBody,
  validateAppleAuthBody,
} from '../validations/socialAuth.validation.js'
import checkAuth from '../middlewares/auth.middleware.js'


const router = Router()

router.post('/signup', validateSignupBody, signupController)
router.post('/google', validateGoogleAuthBody, googleAuthController)
router.post('/facebook', validateFacebookAuthBody, facebookAuthController)
router.post('/apple', validateAppleAuthBody, appleAuthController)
router.post('/login', validateLoginBody, loginController)
router.post('/logout', logoutController)
router.post('/refresh', refreshController)
router.post('/forgot-password/send-otp', validateEmailRequest, forgotPasswordController)
router.post('/forgot-password/verify', validateOTPRequest, verifyOTPController)
router.post('/forgot-password/change', validateOTPPasswordRequest, changePasswordController)
router.patch('/reset-password', checkAuth, validatePasswordRequest, resetPasswordController)

export default router
