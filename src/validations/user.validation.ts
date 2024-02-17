import Joi from 'joi'
import JoiValidation from 'express-joi-validation'

const userValidator = JoiValidation.createValidator({ passError: true })

export interface ChangeNameRequestSchema extends JoiValidation.ValidatedRequestSchema {
  [JoiValidation.ContainerTypes.Body]: {
    name: string;
  }
}

export const validateChangeNameBody = userValidator.body(Joi.object({
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
}))
