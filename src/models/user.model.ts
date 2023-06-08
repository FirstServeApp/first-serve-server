import { Schema, model, Document, Model } from 'mongoose'


export interface IUser extends Document {
  _id: Schema.Types.ObjectId;
  name: string;
  email: string;
  avatar?: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  avatar: { type: String },
}, {
  timestamps: true,
  strict: 'throw',
})

export const UserModel: Model<IUser> = model<IUser>('User', UserSchema)
