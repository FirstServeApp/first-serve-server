import Joi from 'joi'
import JoiValidation from 'express-joi-validation'

const imageValidator = JoiValidation.createValidator({ passError: true })

export interface DeleteImageRequestSchema extends JoiValidation.ValidatedRequestSchema {
  [JoiValidation.ContainerTypes.Params]: {
    url: string;
  }
}

export const validateDeleteImageBody = imageValidator.params(Joi.object({
  url: Joi
    .string()
    .uri()
    .regex(/^(?:.*\/)?(?<public_id>[^./]+)(?:\.[^.]*$|$)/)
    .required()
    .messages({
      'string.uri': 'Invalid URL format',
      'any.required': 'URL is required',
      'string.empty': 'URL cannot be empty',
      'string.pattern.base': 'Invalid public_id in the URL',
    }),
}))
