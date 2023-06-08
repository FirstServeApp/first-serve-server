import Joi from 'joi'
import JoiValidation from 'express-joi-validation'

const authValidator = JoiValidation.createValidator({ passError: true })

export interface SignupRequestSchema extends JoiValidation.ValidatedRequestSchema {
  [JoiValidation.ContainerTypes.Body]: {
    name: string;
    email: string;
    avatar?: string;
    password: string;
  }
}

export const validateSignupBody = authValidator.body(Joi.object({
  name: Joi
    .string()
    .min(1)
    .max(16)
    .required()
    .messages({
      'any.required': 'Name is required',
      'string.base': 'Name must be a string',
      'string.empty': 'Name cannot be empty',
      'string.min': 'Name should have a minimum length of {#limit}',
      'string.max': 'Name should have a maximum length of {#limit}',
    }),
  email: Joi
    .string()
    .email()
    .required()
    .messages({
      'any.required': 'Please provide an email.',
      'string.base': 'Email must be a string',
      'string.empty': 'Email cannot be empty.',
      'string.email': 'Please provide a valid email address.',
    }),
  avatar: Joi.string().uri().optional(),
  password: Joi
    .string()
    .min(6)
    .max(16)
    .required()
    .messages({
      'any.required': 'Please provide a password.',
      'string.base': 'Password must be a string',
      'string.empty': 'Password cannot be empty.',
      'string.min': 'Password should have a minimum length of {#limit}.',
      'string.max': 'Password should have a maximum length of {#limit}.',
    }),
}))

export interface LoginRequestSchema extends JoiValidation.ValidatedRequestSchema {
  [JoiValidation.ContainerTypes.Body]: {
    email: string;
    password: string;
  }
}

export const validateLoginBody = authValidator.body(Joi.object({
  email: Joi
    .string()
    .email()
    .required()
    .messages({
      'any.required': 'Please provide an email.',
      'string.base': 'Email must be a string',
      'string.empty': 'Email cannot be empty.',
      'string.email': 'Please provide a valid email address.',
    }),
  password: Joi
    .string()
    .min(6)
    .max(16)
    .required()
    .messages({
      'any.required': 'Please provide a password.',
      'string.base': 'Password must be a string',
      'string.empty': 'Password cannot be empty.',
      'string.min': 'Password should have a minimum length of {#limit}.',
      'string.max': 'Password should have a maximum length of {#limit}.',
    }),
}))

export interface EmailRequestSchema extends JoiValidation.ValidatedRequestSchema {
  [JoiValidation.ContainerTypes.Body]: {
    email: string;
  }
}

export const validateEmailRequest = authValidator.body(Joi.object({
  email: Joi
    .string()
    .email()
    .required()
    .messages({
      'any.required': 'Please provide an email.',
      'string.base': 'Email must be a string',
      'string.empty': 'Email cannot be empty.',
      'string.email': 'Please provide a valid email address.',
    }),
}))

export interface OTPRequestSchema extends JoiValidation.ValidatedRequestSchema {
  [JoiValidation.ContainerTypes.Body]: {
    otpCode: string;
    id: string;
  }
}

export const validateOTPRequest = authValidator.body(Joi.object({
  otpCode: Joi
    .string()
    .length(4)
    .required()
    .messages({
      'any.required': 'OTP is required',
      'string.base': 'OTP must be a string',
      'string.length': 'OTP must be exactly 4 characters',
    }),
  id: Joi
    .string()
    .required()
    .regex(/^[a-f\d]{24}$/i)
    .messages({
      'any.required': 'id is required',
      'string.pattern.base': 'id must be a valid ObjectId',
    }),
}))

export interface PasswordOTPRequestSchema extends JoiValidation.ValidatedRequestSchema {
  [JoiValidation.ContainerTypes.Body]: {
    password: string;
    id: string;
  }
}

export const validateOTPPasswordRequest = authValidator.body(Joi.object({
  password: Joi
    .string()
    .min(6)
    .max(16)
    .required()
    .messages({
      'any.required': 'Please provide a password.',
      'string.base': 'Password must be a string',
      'string.empty': 'Password cannot be empty.',
      'string.min': 'Password should have a minimum length of {#limit}.',
      'string.max': 'Password should have a maximum length of {#limit}.',
    }),
  id: Joi
    .string()
    .required()
    .regex(/^[a-f\d]{24}$/i)
    .messages({
      'any.required': 'id is required',
      'string.pattern.base': 'id must be a valid ObjectId',
    }),
}))

export interface PasswordRequestSchema extends JoiValidation.ValidatedRequestSchema {
  [JoiValidation.ContainerTypes.Body]: {
    password: string;
  }
}

export const validatePasswordRequest = authValidator.body(Joi.object({
  password: Joi
    .string()
    .min(6)
    .max(16)
    .required()
    .messages({
      'any.required': 'Please provide a password.',
      'string.base': 'Password must be a string',
      'string.empty': 'Password cannot be empty.',
      'string.min': 'Password should have a minimum length of {#limit}.',
      'string.max': 'Password should have a maximum length of {#limit}.',
    }),
}))
