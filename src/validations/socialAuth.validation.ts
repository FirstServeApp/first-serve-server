import Joi from 'joi'
import JoiValidation from 'express-joi-validation'

const socialAuthValidator = JoiValidation.createValidator({ passError: true })

export enum SocialAuthIdNames {
  googleId = 'googleId',
  facebookId = 'facebookId',
  appleId = 'appleId'
}

export interface SocialAuthRequestSchema extends JoiValidation.ValidatedRequestSchema {
  [JoiValidation.ContainerTypes.Body]: {
    name: string;
    email: string;
    avatar?: string;
    googleId?: string;
    facebookId?: string;
    appleId?: string;
  }
}

export const validateGoogleAuthBody = socialAuthValidator.body(Joi.object({
  name: Joi
    .string()
    .min(1)
    .max(64)
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
  googleId: Joi
    .string()
    .required()
    .messages({
      'any.required': 'googleId is required',
      'string.base': 'googleId must be a string',
      'string.empty': 'googleId cannot be empty.',
    }),
}))

export const validateFacebookAuthBody = socialAuthValidator.body(Joi.object({
  name: Joi
    .string()
    .min(1)
    .max(64)
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
  facebookId: Joi
    .string()
    .required()
    .messages({
      'any.required': 'facebookId is required',
      'string.base': 'facebookId must be a string',
      'string.empty': 'facebookId cannot be empty.',
    }),
}))

export const validateAppleAuthBody = socialAuthValidator.body(Joi.object({
  name: Joi
    .string()
    .min(1)
    .max(64)
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
  appleId: Joi
    .string()
    .required()
    .messages({
      'any.required': 'appleId is required',
      'string.base': 'appleId must be a string',
      'string.empty': 'appleId cannot be empty.',
    }),
}))
