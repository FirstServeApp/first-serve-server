import { Schema, model } from 'mongoose'

export interface IOTP {
  _id: Schema.Types.ObjectId;
  user_id: Schema.Types.ObjectId;
  otp: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OTPSchema = new Schema<IOTP>({
  user_id: { type: Schema.Types.ObjectId, ref: 'User' },
  otp: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
}, {
  timestamps: true,
})

OTPSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 300 }) // expire after 15 minute

export const OTPModel = model<IOTP>('OTP', OTPSchema)
