import { Schema } from 'mongoose'
import { IUser } from '../models/user.model.js'
import { ISocialUser } from '../models/socialUser.model.js'

export interface IUserDto {
  name: string;
  email: string;
  _id: Schema.Types.ObjectId;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserDto implements IUserDto {
  name: string
  email: string
  _id: Schema.Types.ObjectId
  avatar?: string
  createdAt: Date
  updatedAt: Date

  constructor(model: IUser | ISocialUser) {
    this.name = model.name
    this.email = model.email
    this._id = model._id
    this.avatar = model.avatar
    this.createdAt = model.createdAt
    this.updatedAt = model.updatedAt
  }
}
