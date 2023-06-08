import { Model, Schema, model } from 'mongoose'

export interface ISocialUser {
  _id: Schema.Types.ObjectId;
  googleId: string;
  appleId: string;
  facebookId: string;
  avatar?: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const SocialUserSchema = new Schema<ISocialUser>({
  googleId: { type: String, trim: true },
  appleId: { type: String, trim: true },
  facebookId: { type: String, trim: true },
  email: { type: String, unique: true, trim: true, lowercase: true, required: true },
  name: { type: String, required: true, trim: true },
  avatar: { type: String },
}, {
  timestamps: true,
})

export const SocialUserModel: Model<ISocialUser> = model<ISocialUser>('SocialUser', SocialUserSchema)
