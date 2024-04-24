import Joi from 'joi'
import JoiValidation from 'express-joi-validation'
import { Schema } from 'mongoose'
import { ISet } from '../models/match.model.js'

const matchValidator = JoiValidation.createValidator({ passError: true })

export interface MatchRequestSchema extends JoiValidation.ValidatedRequestSchema {
  [JoiValidation.ContainerTypes.Body]: {
    winner: string;
    opponentName: string;
    setsArr: ISet[];
    duration: number;
  }
}

export const validateCreateMatchBody = matchValidator.body(Joi.object({
  winner: Joi
    .string()
    .trim()
    .required()
    .messages({ 'any.required': 'winner is required' }),
  opponentName: Joi
    .string()
    .trim()
    .required()
    .messages({ 'any.required': 'opponentName is required' }),
  setsArr: Joi
    .array()
    .required()
    .items(Joi.object({
      index: Joi
        .number()
        .required()
        .messages({
          'any.required': 'Set index is required',
          'number.base': 'Set index should be a number',
        }),
      myScore: Joi
        .number()
        .required()
        .messages({
          'any.required': 'myScore is required',
          'number.base': 'myScore should be a number',
        }),
      opponentScore: Joi
        .number()
        .required()
        .messages({
          'any.required': 'opponentScore is required',
          'number.base': 'opponentScore should be a number',
        }),
      games: Joi.array().required(),
    }))
    .min(1)
    .max(3)
    .messages({
      'array.base': 'Sets array should be an array',
      'array.min': 'setsArr must include at least 1 set',
      'array.max': 'setsArr must include a maximum of 3 sets',
      'any.required': 'Sets array is required',
      'array.items': 'Each set should contain index, myScore, opponentScore, myServes, and opponentServes',
    }),
  duration: Joi
    .number()
    .required()
    .messages({
      'any.required': 'duration is required',
      'number.base': 'duration should be a number',
    }),
}))

export interface GetByIdRequestSchema extends JoiValidation.ValidatedRequestSchema {
  [JoiValidation.ContainerTypes.Query]: {
    id: Schema.Types.ObjectId;
  }
}

export const validateRequestParamId = matchValidator.params(Joi.object({
  id: Joi
    .string()
    .required()
    .regex(/^[a-f\d]{24}$/i)
    .messages({
      'any.required': 'id param is required',
      'string.pattern.base': 'id param must be a valid ObjectId',
    }),
}))

export interface PaginationQueryScema extends JoiValidation.ValidatedRequestSchema {
  [JoiValidation.ContainerTypes.Query]: {
    page?: string;
    pageSize?: string;
  }
}

export const validatePaginationQuery = matchValidator.query(Joi.object({
  page: Joi
    .number()
    .optional()
    .messages({
      'number.base': 'Page value must be a number',
      'any.required': 'Page value is required',
      'string.empty': 'Page value cannot be empty',
    }),
  pageSize: Joi
    .number()
    .optional()
    .min(5)
    .max(50)
    .messages({
      'number.base': 'Page size must be a number',
      'number.min': 'Page size must be at least 5',
      'number.max': 'Page size cannot be greater than 50',
    }),
}))

export interface DateFilterSchema extends JoiValidation.ValidatedRequestSchema {
  [JoiValidation.ContainerTypes.Query]: {
    from: Date;
    to: Date;
    page?: string;
    pageSize?: string;
  }
}

export const validateDateFilterQuery = matchValidator.query(Joi.object({
  from: Joi
    .string()
    .isoDate()
    .required()
    .messages({
      'any.required': '`from` query param is required',
      'string.isoDate': '`from` query param must be a valid ISO date string',
    }),
  to: Joi
    .string()
    .isoDate()
    .required()
    .messages({
      'any.required': '`to` param is required',
      'string.isoDate': '`to` query param must be a valid ISO date string',
    }),
  page: Joi
    .number()
    .optional()
    .messages({
      'number.base': 'Page value must be a number',
      'string.empty': 'Page value cannot be empty',
    }),
  pageSize: Joi
    .number()
    .optional()
    .min(5)
    .max(50)
    .messages({
      'number.base': 'Page size must be a number',
      'number.min': 'Page size must be at least 5',
      'number.max': 'Page size cannot be greater than 50',
    }),
}))

export interface PlayersFilterSchema extends JoiValidation.ValidatedRequestSchema {
  [JoiValidation.ContainerTypes.Query]: {
    players: string;
    page?: string;
    pageSize?: string;
  }
}

export const validatePlayersFilterQuery = matchValidator.query(Joi.object({
  players: Joi
    .string()
    .required()
    .messages({
      'any.required': 'Players query param is required',
      'string.empty': 'Players query param cannot be empty',
      'string.base': 'Players must be a string',
    }),
  page: Joi
    .number()
    .optional()
    .messages({
      'number.base': 'Page value must be a number',
      'string.empty': 'Page value cannot be empty',
    }),
  pageSize: Joi
    .number()
    .optional()
    .min(5)
    .max(50)
    .messages({
      'number.base': 'Page size must be a number',
      'number.min': 'Page size must be at least 5',
      'number.max': 'Page size cannot be greater than 50',
    }),
}))

export interface GetAllMatchesSchema extends JoiValidation.ValidatedRequestSchema {
  [JoiValidation.ContainerTypes.Query]: {
    from?: Date;
    to?: Date;
    players?: string;
    page?: string;
    pageSize?: string;
  }
}

export const validateGetAllMatchesQuery = matchValidator.query(Joi.object({
  from: Joi
    .string()
    .optional()
    .isoDate()
    .messages({
      'string.isoDate': '`from` query param must be a valid ISO date string',
    }),
  to: Joi
    .string()
    .optional()
    .isoDate()
    .messages({
      'string.isoDate': '`to` query param must be a valid ISO date string',
    }),
  players: Joi
    .string()
    .optional()
    .messages({
      'string.empty': 'Players query param cannot be empty',
      'string.base': 'Players must be a string',
    }),
  page: Joi
    .number()
    .optional()
    .messages({
      'number.base': 'Page value must be a number',
      'string.empty': 'Page value cannot be empty',
    }),
  pageSize: Joi
    .number()
    .optional()
    .min(5)
    .max(150)
    .messages({
      'number.base': 'Page size must be a number',
      'number.min': 'Page size must be at least 5',
      'number.max': 'Page size cannot be greater than 150',
    }),
}))

export interface ChangeOpponentNameSchema extends JoiValidation.ValidatedRequestSchema {
  [JoiValidation.ContainerTypes.Body]: {
    opponentName: string;
  },
}

export const validateChangeOpponentNameSchema = matchValidator.body(Joi.object({
  opponentName: Joi
    .string()
    .trim()
    .required()
    .messages({ 'any.required': 'opponentName is required' }),
}))
