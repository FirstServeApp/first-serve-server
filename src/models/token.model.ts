import { Schema, model } from 'mongoose'

export interface IToken {
  user_id: Schema.Types.ObjectId;
  refreshToken: string;
}

const TokenSchema = new Schema<IToken>({
  user_id: { type: Schema.Types.ObjectId, ref: 'User' },
  refreshToken: { type: String, required: true },
})

export const TokenModel = model<IToken>('Token', TokenSchema)
